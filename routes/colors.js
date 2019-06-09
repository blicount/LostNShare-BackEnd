const express   = require('express');
const router    = express.Router();
const Color  = require('../models/Colors'); 


//get all categorys

router.get('/getAllColors', (req,res) => {
     Color.find({}).sort({name: 1 } )
    .then(col => {
        if(col.length > 0){
            res.status(200).json(col);
        }else{
            res.status(200).send('something went wrong Colors wsent found');
        }
    });
});

router.post('/createNewColor', (req,res)=>{
    let newColor = new Color({
        name:req.body.color
    });
    newColor.save()
        .then(Color=>{
            if(Color){
                res.status(200).send('new Color add secssesfully');
            }else{
                res.status(200).send('somthing went wrong Color wsent cateated');
            }
        })
        .catch(err=> res.status(200).send( `error in delete() ${err}`))
});

router.post('/deleteColor' , (req,res)=>{
    let id = req.body.id;
    Color.deleteOne({_id : id})
        .then(sha => {
            if(sha.deletedCount){
                res.status(200).send('Color deleted');
            }else{
                res.status(200).send('Color was not found');
            }
        })
        .catch(err => res.status(200).send( `error in delete() ${err}`))
});

module.exports = router;