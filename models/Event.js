const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    events:{
        type: [String],
        required:true
    }


}); 

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;