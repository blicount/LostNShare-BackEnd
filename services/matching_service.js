const moment        = require('moment');
const Item          = require('../models/Item'); 
const eventhndler   = require('../services/eventHndler');

function getAllActiveItems(){
    return new Promise((resolve , reject) => {
        Item.find({ itemstate :'active' }).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                resolve(item);
            }else{
                reject('no Items found');
            }
        });
    });
}

function getAllLostItems(){
    return new Promise((resolve , reject) => {
        console.log('got to getAllLostItems');
        Item.find({ itemstate :'active' ,itemtype : 'lost'}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                resolve(item);
            }else{
                reject('no Items found');
            }
        });
    });
}

function getAllFoundItems(){
    return new Promise((resolve , reject) => {
        console.log('got to getAllFoundItems');
        Item.find({itemstate : 'active', itemtype : 'found'}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                resolve(item);
            }else{
                reject('no Items found');
            }
        });
    });
}

function getItemById(id){
    return new Promise((resolve , reject) => {
        Item.findOne({_id: id})
        .then(item => {
            if(item){
                resolve(item);
            }else{
                reject('getitembyid function : item was not found');
            }
        });
    });
}

function check_match_rank(item1 , item2){

    return new Promise((resolve,reject) =>{
    let match_rank = 0 ;
    if(item1.category === item2.category)
        match_rank++ ; 
    if(item1.subcategory === item2.subcategory)
        match_rank++ ;
    if(item1.location === item2.location)
        match_rank++ ;
    if(match_rank < 2 )
        resolve(match_rank)
    if(item1.title === item2.title)
        match_rank++ ;
    if(item1.shape === item2.shape)
        match_rank++ ;
    if(item1.color === item2.color)
        match_rank++ ;
    console.log(item1._id+' '+item1.itemtype +' '+item2._id+' '+item2.itemtype +' '+ match_rank);
    resolve(match_rank);
    });   
}

function chackIfBigger(num , matchs_array){
//   console.log('got to chack if bigger');
    if(num === 0){
        return false;
    }
    if(matchs_array.length === 0 && num > 0 ){
        return true;
    }
    for(const item of matchs_array) {
                if(num >= item.rank){
                return true;
                }
    }
    return false;
}
function updateLastMatchDate(id){
    let massege;
    Item.updateOne({_id:id} ,{$set: { last_match : Date.now() } } )
        .then(it =>{
            if(it.n){ 
                if(it.nModified){
                    massege = `Last_match_date was careated seccsesfuly`;
                }else{
                    massege = `matching wasn't updated last match date`;
                        }     
            }else{
                massege = `Item wasn't found`;
            }
        })
        .catch(err => console.log(err));
}

function updateMatchingItemsArray(itemid,matcheditem,numbermatcheditem){
    let messages=[];
    if(numbermatcheditem < 4){
        Item.updateOne({_id:itemid},{
            $push: {
                matching_items:{ 
                    $each : [matcheditem],
                    $sort : {rank : 1}
                } 
            } 
        })
        .then(it =>{
            if(it.n){ 
                if(it.nModified){
                    eventhndler.createEvent(itemid._id, `matching services was activated on ${moment()}`)
                    updateLastMatchDate(itemid._id);
                    messages.push(`matching items was modified seccsesfuly`);
                }else{
                    messages.push(`faild to modified matching items`);
                }       
            }else{
                messages.push(`item wasn't found`);
            }
        })
        .catch(err => console.log(err));
    }else{
        Item.update( { _id: itemid }, { $pop: { matching_items: -1 } } )
            .then(it =>{
                if(it.n){ 
                    if(it.nModified){
                        messages.push(`matching items was full so one item poped`);
                            Item.updateOne({_id:itemid},{
                                $push: {
                                    matching_items:{ 
                                        $each : [matcheditem],
                                        $sort : {rank : 1}
                                    } 
                                } 
                            })
                            .then(it =>{
                                if(it.n){ 
                                    if(it.nModified){
                                        updateLastMatchDate(itemid._id);
                                        messages.push(`matching items was modified seccsesfuly`);
                                    }else{
                                        messages.push(`faild to modified matching items`);
                                    }       
                                }else{
                                    messages.push(`item wasn't found`);
                                }
                            })
                            .catch(err => console.log(err));
                    }else{
                        messages.push(`faild to pop item from matching items`);
                    }       
                }else{
                    messages.push(`item wasn't found`);
                }
            })
            .catch(err => console.log(err));
    }
}

module.exports = {

match_all : async function matching_service(){
    //let items_list = await this.getAllItems();
    let found_items_list = await getAllFoundItems();
    let lost_items_list = await getAllLostItems();
    let match_rank = 0;
    let messages = [];
    for(let lost_item of  lost_items_list){
        for(let found_item of found_items_list){
            if(moment(lost_item.last_match).isAfter(found_item.careationdate)) continue;
            match_rank = await check_match_rank(lost_item , found_item);
            let lost_matching_items = lost_item.matching_items;
            let found_matching_items = found_item.matching_items;
            let current_found_item = found_item._id;
            let current_lost_item = lost_item._id;
            if(chackIfBigger(match_rank,lost_matching_items)){
                //case there is matching need to push item to matching items array
                let new_match_item = {
                    itemId : found_item._id,
                    rank : match_rank
                }
                updateMatchingItemsArray(current_lost_item,new_match_item,lost_matching_items.length);                
            }
            if(moment(found_item.last_match).isAfter(lost_item.careationdate)) continue;
            if(chackIfBigger(match_rank,found_matching_items)){
                    let new_match_item = {
                        itemId : lost_item._id,
                        rank : match_rank
                    }
                    updateMatchingItemsArray(current_found_item,new_match_item,found_matching_items.length);
            }
        }    
    }
},


match_single : async function matching_service_for_item(itemid){
    //let items_list = await this.getAllItems();
    let curretitem = await getItemById(itemid);
    let match_rank = 0;
    let messages = [];
    if(curretitem.itemtype === 'lost'){
        let found_items_list = await getAllFoundItems();
        for(let found_item of found_items_list){
            if(moment(curretitem.last_match).isAfter(found_item.careationdate)) continue;
            match_rank = await check_match_rank(curretitem , found_item);
            let current_matching_items = curretitem.matching_items;
            if(chackIfBigger(match_rank,current_matching_items)){
                //case there is matching need to push item to matching items array
                let new_match_item = {
                    itemId : found_item._id,
                    rank : match_rank
                }
                updateMatchingItemsArray(curretitem._id,new_match_item,current_matching_items.length);                
            }
        }
    }else{
        let lost_items_list = await getAllLostItems();
        for(let lost_item of lost_items_list){
            if(moment(curretitem.last_match).isAfter(lost_item.careationdate)) continue;
            match_rank = await check_match_rank(curretitem , lost_item);
            let current_matching_items = curretitem.matching_items;
            if(chackIfBigger(match_rank,current_matching_items)){
                //case there is matching need to push item to matching items array
                let new_match_item = {
                    itemId : lost_item._id,
                    rank : match_rank
                }
                updateMatchingItemsArray(curretitem._id,new_match_item,current_matching_items.length);                
            }
        }

    }
}

};


