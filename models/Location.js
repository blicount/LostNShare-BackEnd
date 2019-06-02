const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    Location:{
        type: String,
        required:true
    }


}); 

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;