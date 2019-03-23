const express   = require('express');
const router    = express.Router();
const Item      = require('../models/Item'); 
const Event     = require('../models/Event');
const multer    = require('multer');
const moment    = require('moment');

// imeg storege config
const storage    = multer.diskStorage({
    destination : (req , file , cb) =>{
        cb(null , './uploads/');
    },

    filename : (req , file , cb) =>{
        cb(null ,file.originalname);
    }
})

// validate file type
const filter = (req , file , cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/pdf'){
        cb(null , true);
    }else{
        cb(new Error('file type error') , false);
    }
};

const upload = multer({
    storage     : storage, 
    //limiting uploading Image size to 2 mb
    limits      : {fileSize : 1024*1024*2},
    fileFilter  : filter
});


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



//get all active items
router.get('/getAllItems', (req,res) => {
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
router.get('/getAllLostItems', (req,res) => {
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
router.get('/getAllFoundItems', (req,res) => {
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


router.get('/getAllItemsByFillters/', (req,res) => {
    let category = req.header('category');
    let subcategory = req.header('subcategory');
    let location = req.header('location');
    let startdate = req.header('startdate');
    let enddate = req.header('enddate');
    let type = req.header('type');    
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
router.get('/getItemById', (req,res) => {
    let itemid = req.header('id');
    Item.findOne({id : id})
        .then(item => {
            if(item){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by categoty
router.get('/getItemByCategory', (req,res) => {
    let category = req.header('category');
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
router.get('/getItemBySubCategory', (req,res) => {
    let subcategory = req.header('subcategory');
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
router.get('/getItemByLocation', (req,res) => {
    let location = req.header('location');
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
router.get('/getItemByOwner', (req,res) => {
    let email = req.header('email');
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
    console.log(req.file);
    let answer = {};
    console.log('---------------------');
    const {email,itemtype,title, category, subcategory,location,desc } = req.body;
    let newitem = new Item({
        owner       : email,
        itemtype    : itemtype,
        title       : title,
        category    : category,
        subcategory : subcategory,
        picpath     : req.file.path,
        location    : location,
        eventlistid : null,
        desc        : desc
    });
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


module.exports = router;