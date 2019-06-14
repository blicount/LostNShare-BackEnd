const express   = require('express');
const router    = express.Router();
const Shape  = require('../models/Shape'); 


//get all shapes

router.get('/getAllShapes', (req,res) => {
     Shape.find({}).sort({name: 1 } )
    .then(sha => {
        if(sha.length > 0){
            res.status(200).json(sha);
        }else{
            res.status(200).send('something went wrong shapes wsent found');
        }
    });
});

router.post('/createNewShape', (req,res)=>{
    let newshape = new Shape({
        name:req.body.shape
    });
    newshape.save()
        .then(shape=>{
            if(shape){
                res.status(200).send('new shape add secssesfully');
            }else{
                res.status(200).send('somthing went wrong shape wsent cateated');
            }
        })
        .catch(err=> res.status(200).send( `error in delete() ${err}`))
});

router.post('/deleteShape' , (req,res)=>{
    let id = req.body.id;
    Shape.deleteOne({_id : id})
        .then(sha => {
            if(sha.deletedCount){
                res.status(200).send('shape deleted');
            }else{
                res.status(200).send('shape was not found');
            }
        })
        .catch(err => res.status(200).send( `error in delete() ${err}`))
});


module.exports = router;