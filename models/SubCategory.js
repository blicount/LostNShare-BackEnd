const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    subcategorylist:{
        type: [String],
        required:true
    }


}); 

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;