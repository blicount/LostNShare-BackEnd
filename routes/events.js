const express       = require('express');
const router        = express.Router();
const Event         = require('../models/Event'); 
const userhndler    = require('../services/userHndler');


//get all system events 

function movefromarrays(first,second){
    for(let elem of second){
        first.push(elem);
    }
}

router.get('/allSystemEvents',(req,res) =>{
    let allevents = [];
    Event.find({})
        .then(events => {
            if(events){
                for(let event of events){
                    movefromarrays(allevents,event.events);    
                }
                res.status(200).send(allevents);
            }else{
                res.status(200).send('no events found');
            }
        })
        .catch()
});
module.exports = router;

