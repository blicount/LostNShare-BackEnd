const moment  = require('moment');
const Item      = require('../models/Item'); 
const item_route = require('../routes/items');

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
        Item.findOne({_id: id ,itemstate : 'active' })
        .then(item => {
            if(item){
                resolve(item);
            }else{
                reject('getitembyid functio : item was not found');
            }
        });
    });
}

function check_match_rank(item1 , item2){

    return new Promise((resolve,reject) =>{
        let match_rank = 0;
    if(item1.category === item2.category)
        match_rank++;
    if(item1.subcategory === item2.subcategory)
        match_rank++
    if(item1.location === item2.location)
        match_rank++
    if(item1.title === item2.title)
        match_rank++
    console.log(item1._id+' '+item1.itemtype +' '+item2._id+' '+item2.itemtype +' '+ match_rank);
    
    resolve(match_rank);
    });
    
}

function chackIfBigger(num , matchs_array){
//   console.log('got to chack if bigger');
    for(const item of matchs_array) {
            if(typeof(item.rank) === 'number'){
                if(num >= item.rank){
                return true;
                }
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
    console.log(massege);
}

function updateMatchingItemsArray(itemid,matcheditem){
    let messages=[];
    Item.updateOne({_id:itemid},{
        $push: {
            matching_items:{ 
                $each : [matcheditem],
                $position : 0 
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
}



async function matching_service(){
    //let items_list = await this.getAllItems();
    let found_items_list = await getAllFoundItems();
    let lost_items_list = await getAllLostItems();
    let match_rank = 0;
    let messages = [];
    for(let lost_item of  lost_items_list){
        for(let found_item of found_items_list){
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
                updateMatchingItemsArray(current_lost_item,new_match_item);                
            }
            if(chackIfBigger(match_rank,found_matching_items)){
                let new_match_item = {
                    itemId : lost_item._id,
                    rank : match_rank
                }
                updateMatchingItemsArray(current_found_item,new_match_item);
            }
        }    
    }
}

module.exports = matching_service;



