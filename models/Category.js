const mongoose = require('mongoose');

function getSubCtegoryid(category){
    Category.find({name : category})
        .then(category => {
            if(category.length > 0){
                return category.subcategoriesid
            }else{
                res.status(200).send('no Items found');
            }
        });   
}

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    subcategoriesid:{
        type: String,
        required:true
    }


}); 

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;