const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        requierd:true
    },
    date:{
        type: Date,
        default:Date.now()
    }


}); 

const User = mongoose.model('User', UserSchema);

module.exports = User;