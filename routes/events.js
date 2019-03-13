const express   = require('express');
const router    = express.Router();
const Event      = require('../models/Event'); 

//get event list

module.exports = class Events{

    constructor(){}
    getevent(eventid){
        Event.findOne({_id : eventid})
            .then(event => {
                if(event)
                    return event;
                else
                    return 'oops, no events found';
            });
    }


    reateEvent(eventid,eventdesc){
        Event.findOne({_id : eventid})
            .then(event => {
                if(event){
                    event.events.push(eventdesc);
                    return event._id;
                }else
                    return 'oops, no events found';
            });
    }

    initEvent(req,res){
        let newevent = new Event({
            events : 'item was created'
        }); 
        newevent.save()
        .then(event => {
            if(event){
                return 'event._id';
            }else
                return 'event creation faild';
        })
        .catch(err => {return 'got error from event.save()'});
    }
}

