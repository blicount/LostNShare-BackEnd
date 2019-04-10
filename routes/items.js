const express   = require('express');
const router    = express.Router();
const Item      = require('../models/Item'); 
const Event     = require('../models/Event');
const upload   = require('../services/uploadtos3');

// initalize event data object
  function initEvent(req,res){
    return new Promise((resolve,reject)=> {
        let newevent = new Event({
            events : ['item was created'+Date.now()]
        }); 
        newevent.save()
            .then(event => {
                if(event){
                    console.log('eventid -------------- '+event._id);
                    resolve(event._id);
                }else
                    resolve('event creation faild');
            })
            .catch(err => {reject(err)});  
    });
}

function createEvent(itemid,eventdesc){
    Item.findOne({_id : itemid})
        .then(item => {
            if(item){
                Event.updateOne({_id : item.eventlistid},{$push: {events:eventdesc }})
                    .then(event=>{
                        if(event.nModified){
                            return 1;
                        }else
                            return 0;
                    })
                    .catch(err=> console.log(err))//res.status(200).send('category careation failed'))
            }else{
                return 0;
            }
        })
        .catch()
    
        
}

//get all active items
router.get('/getAllActiveItems', (req,res) => {
    Item.find({itemstate:'active'}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});

//get all items
router.get('/getAllItems', (req,res) => {
    Item.find({}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});


//get all Lost items
router.get('/getAllActiveLostItems', (req,res) => {
    Item.find({itemstate:'active',itemtype:'lost'}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});

//get all Found items
router.get('/getAllActiveFoundItems', (req,res) => {
    Item.find({itemstate:'active',itemtype:'found'}).sort({careationdate: -1 } )
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});

//get all  items by fillters


router.post('/getAllItemsByFillters/', (req,res) => {
    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let type = req.body.type;    
    startdate ? startdate : startdate= new Date('1995-12-17T03:24:00'); ;
    enddate ? enddate : enddate= Date.now() ;
    console.log(category);
    console.log(subcategory);
    console.log(location);
    console.log(startdate);
    console.log(enddate);
    console.log(type);

    if(category && subcategory && location){    // // got category & subcategory & location 
        Item.find({itemstate:'active',
            itemtype : type, 
            category : category, 
            subcategory : subcategory,
            location : location,
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
    }else if(category){
        if(subcategory){  // got category & subcategory
            Item.find({itemstate:'active',
            itemtype : type, 
            category : category, 
            subcategory : subcategory,
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
        }else if(location){ // got category & location
            Item.find({itemstate:'active',
            itemtype : type, 
            category : category, 
            location : location,
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
        }else{   // got only category
            Item.find({itemstate:'active',
            itemtype : type, 
            category : category, 
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
        }

    }else if(location){
        Item.find({itemstate:'active',
            itemtype : type, 
            location : location, 
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
    }else{
        Item.find({itemstate:'active',
            itemtype : type, 
            careationdate: {
                $gte: startdate,
                $lte: enddate
            } 
        }).sort({careationdate: -1 } )
            .then(items => {
                if(items.length > 0){
                    res.status(200).json(items);
                }else{
                    res.status(200).send('no Items found');
                }
            });
    }   
});


//get Item by ID
router.post('/getItemById', (req,res) => {
    let itemid = req.body.id;
    Item.findOne({_id : itemid})
        .then(item => {
            if(item){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by categoty
router.post('/getItemByCategory', (req,res) => {
    let category = req.body.category;
    Item.find({category : category})
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by subcategoty
router.post('/getItemBySubCategory', (req,res) => {
    let subcategory = req.body.subcategory;
    Item.find({subcategory : subcategory})                     
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by Location
router.post('/getItemByLocation', (req,res) => {
    let location = req.body.location;
    Item.find({location : location})                     
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by owner
router.post('/getItemByOwner', (req,res) => {
    let email = req.body.email;
    Item.find({owner : email})                     
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});



//create Item
router.post('/createItem', upload.single('ItemImage') ,(req,res) => {
    let answer = {};
    let newitem;
    console.log(req.file.location);
    const {email,itemtype,title, category, subcategory,location,desc } = req.body;
    if(req.file){
            newitem = new Item({
            owner       : email,
            itemtype    : itemtype,
            title       : title,
            category    : category,
            subcategory : subcategory,
            picpath     : req.file.location,
            location    : location,
            eventlistid : null,
            desc        : desc
        });
    }else{
            newitem = new Item({
            owner       : email,
            itemtype    : itemtype,
            title       : title,
            category    : category,
            subcategory : subcategory,
            picpath     : 'uploads/defult.jpg',
            location    : location,
            eventlistid : null,
            desc        : desc
        });
    }
    console.log(newitem);
    newitem.save()
        .then(async item => {
            let eventid = await initEvent();
            Item.updateOne({_id:item._id} ,{$set: { eventlistid : eventid } } )
                .then(it =>{
                    if(it.n){ 
                        if(it.nModified){
                            answer.message = `Item was careated seccsesfuly`;
                        }else{
                            answer.message = `Item was careated without event list`;
                        }     
                    }else{
                        answer.message = `Item was careated without event list`;
                    }
                })
                .catch(err => console.log(err));
            answer.status = 'success';
            answer.message ='item is created successfuly';
            res.status(200).json(answer);
        })
        .catch(err => console.log(err));
});

//update item status 
router.put( '/UpdateItem' ,upload.single('ItemImage') , (req,res)=> {
    let id = req.body.id;
    let type = req.body.type    
    let newstate = req.body.state;
    let title = req.body.title;
    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let location = req.body.location;
    let desc = req.body.desc;
    if(req.file){
    Item.updateOne({_id : id},
        {$set: {
            itemtype    : type,
            itemstate   : newstate ,
            updatedate  : Date.now() ,
            title       : title,
            category    : category,
            picpath     : req.file.location, 
            subcategory : subcategory,
            location    : location,
            desc : desc
            }
        })
        .then(item =>{
            if(item.n){ 
                if(item.nModified){
                    createEvent(id , `item updated in ${Date.now()}` );
                    res.status(200).send(`Item updated seccsesfuly`);
                }else{
                    res.status(200).send(`Item was not updated`);
                }     
            }else{
                res.status(200).send(`Item was not found`);
            }
        })
        .catch(err => console.log(err));
    }else{
        Item.updateOne({_id : id},
            {$set: {
                itemtype    : type, 
                itemstate   : newstate ,
                updatedate  : Date.now() ,
                title       : title,
                category    : category,
                subcategory : subcategory,
                location    : location,
                desc        : desc
                }
            })
            .then(item =>{
                if(item.n){ 
                    if(item.nModified){
                        createEvent(id , `item updated in ${Date.now()}` );
                        res.status(200).send(`Item updated seccsesfuly`);
                    }else{
                        res.status(200).send(`Item was not updated`);
                    }     
                }else{
                    res.status(200).send(`Item was not found`);
                }
            })
            .catch(err => console.log(err));

    }
});

//delete item
router.delete('/DeleteItem' , (req,res) => {
    let id = req.body.id;
    let email = req.body.email;
    Item.findOne({_id : id})
        .then(item => {
            if(item.owner !== email)
                res.status(200).send(`user are not item owner`);
            Event.deleteOne({_id : item.eventlistid})
                .then(event => {
                    if(event.deletedCount){
                        Item.deleteOne({_id : id})
                            .then(item => {
                                if(item.deletedCount)
                                    res.status(200).send('Item deleted');
                                res.status(200).send('Item was not found');
                            })
                            .catch(err => res.status(200).send( `error in delete() ${err}`))
                    }else{
                        res.status(200).send(`can't delete events attach to item` )
                    }
                })
                .catch(err => res.status(200).send( `error in event delete() ${err}`))
        })
        .catch(err => res.status(200).send(`can't find Item by id ${err}`))
});


module.exports = router;