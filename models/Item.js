const mongoose = require('mongoose');

const match_item = new mongoose.Schema({
    itemId : String ,
    rank : Number 
},{_id : false});

const ItemSchema = new mongoose.Schema({
    itemtype:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    category:{
        type: String,
        requierd:true
    },
    subcategory:{
        type: String,
        requierd:true
    },
    desc:{
        type : String
    },
    itemstate:{
        type: String,
        default: 'active'
    },
    picpath:{
        type: String
    },
    location:{
        //need to be type Location
        type: String
    },
    propertiesid:{
        // need to be type Properties/id
        type: String
    },
    eventlistid:{
        type: String
    },
    careationdate:{
        type: Date,
        default: Date.now()
    },
    updatedate:{
        type: Date,
        default: Date.now()
    },
    owner:{
        type: String,
        required: true
    },
    // need to add...
    matching_items:{
        type: [match_item]
    },
    last_match:{
        type: Date
    },
    color:{
        type: String
    },
    shape:{
        type: String
    }


}); 

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;