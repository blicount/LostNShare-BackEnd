const express   = require('express');
const router    = express.Router();
const Location  = require('../models/Location'); 


//get all categorys

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


module.exports = router;