const Item      = require('../models/Item'); 
const Event     = require('../models/Event');
const moment    = require('moment');


module.exports = {
    // initalize event data object
    initEvent : function initEvent(req,res){
        return new Promise((resolve,reject)=> {
            let newevent = new Event({
                events : ['item was created'+moment()]
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
    },


    createEvent : function createEvent(itemid,eventdesc){
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
        },

    getItemEventList: function getItemEventList(eventid){
        return new Promise((resolve , reject) => {
            Event.findOne({_id: eventid})
            .then(eventlist => {
                if(eventlist){
                    resolve(eventlist.events);
                }else{
                    reject('getItemEventList function : events was not found');
                }
            })
            .catch(err => console.log(err))
        });
    }
}

