const express   = require('express');
const router    = express.Router();
const Item      = require('../models/Item'); 
const Event     = require('../models/Event');




// initalize event function

  function initEvent(req,res){
    let newevent = new Event({
        events : ['item was created'+Date.now()]
    }); 
    newevent.save()
    .then(event => {
        if(event){
            console.log('eventid -------------- '+event._id);
            return event._id;
        }else
            return 'event creation faild';
    })
    .catch(err => {return 'got error from event.save()'});
}



//get all Lost items
router.get('/getAllLostItems/', (req,res) => {
    Item.find({itemstate:'active',itemtype:'lost'})
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});

//get all Found items
router.get('/getAllFoundItems/', (req,res) => {
    Item.find({itemstate:'active',itemtype:'found'})
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
    Item.find({itemstate:'active', category : category, subcategory : subcategory,location : location,
    careationdate: {
        $gte: startdate,
        $lte: enddate
    } })
        .then(item => {
            if(item.length > 0){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Items found');
            }
        });

});



//get Item by ID
router.get('/getItemById/:id', (req,res) => {
    let itemid = req.params.id;
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
router.get('/getItemByCategory/:category', (req,res) => {
    let category = req.params.category;
    Item.find({category : category})
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});

//get Item by categoty
router.get('/getItemBySubCategory/:subcategory', (req,res) => {
    let subcategory = req.params.subcategory;
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
router.get('/getItemByLocation/:location', (req,res) => {
    let location = req.params.location;
    Item.find({location : location})                     
        .then(item => {
            if(item.length > 0 ){
                res.status(200).json(item);
            }else{
                res.status(200).send('no Item found');
            }
        });

});



//create Item
router.post('/createItem', (req,res) => {
    let answer = {};
    console.log('---------------------');
    const {itemtype,title, category, subcategory, picpath,location,desc } = req.body;
    let newitem = new Item({
        itemtype    : itemtype,
        title       : title,
        category    : category,
        subcategory : subcategory,
        picpath     : picpath,
        location    : location,
        eventlistid : null,
        desc        : desc
    });
    console.log(newitem);
    newitem.save()
        .then(async item => {
            let eventid = await initEvent();
            console.log('eventid -------------- '+eventid);
            Item.updateOne({_id:item._id} ,{$set: { eventlistid : eventid } } )
                .then(mess => console.log('updated'))
                .catch(err => console.log(err));
            answer.status = 'success';
            answer.message ='item is created successfuly';
            res.status(200).json(answer);
        })
        .catch(err => console.log(err));
});


module.exports = router;