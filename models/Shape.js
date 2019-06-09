const mongoose = require('mongoose');

const ShapeSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    }


}); 

const Shape = mongoose.model('Shape', ShapeSchema);

module.exports = Shape;