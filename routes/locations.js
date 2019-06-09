const express   = require('express');
const router    = express.Router();
const Location  = require('../models/Location'); 

router.get('/getAllLocatoins', (req,res) => {
     Location.find({}).sort({name: 1 } )
    .then(loc => {
        if(loc.length > 0){
            res.status(200).json(loc);
        }else{
            res.status(200).send('something went wrong location wsent found');
        }
    });
});


router.post('/createNewLocation', (req,res)=>{
    let newLocation = new Location({
        name:req.body.location
    });
    newLocation.save()
        .then(Location=>{
            if(Location){
                res.status(200).send('new Location add secssesfully');
            }else{
                res.status(200).send('somthing went wrong Location wsent cateated');
            }
        })
        .catch(err=> res.status(200).send( `error in delete() ${err}`))
});


router.post('/deleteLocation' , (req,res)=>{
    let id = req.body.id;
    Location.deleteOne({_id : id})
        .then(sha => {
            if(sha.deletedCount){
                res.status(200).send('Location deleted');
            }else{
                res.status(200).send('Location was not found');
            }
        })
        .catch(err => res.status(200).send( `error in delete() ${err}`))
});



module.exports = router;