const express   = require('express');
const router    = express.Router();
const Item      = require('../models/Item'); 
const events     = require('./events');


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
    let event = new events();
    let eventid = event.initEvent();
    console.log('---------------------');
    console.log(eventid);
    const {itemtype,title, category, subcategory, picpath,location,desc } = req.body;
    let newitem = new Item({
        itemtype    : itemtype,
        title       : title,
        category    : category,
        subcategory : subcategory,
        picpath     : picpath,
        location    : location,
        eventlistid : eventid,
        desc        : desc
    });
    console.log(newitem);
    newitem.save()
        .then(item => {
            answer.status = 'success';
            answer.message ='item is created successfuly';
            res.status(200).json(answer);
        })
        .catch(err => console.log(err));
});


module.exports = router;