const express   = require('express');
const router    = express.Router();
const SubCategory      = require('../models/SubCategory'); 
const Category      = require('../models/Category'); 


//get all categorys

router.get('/getAllSubCategoryByCategory/:category', (req,res) => {
    let subcategoryid;
    let category = req.params.category;

    Category.findOne({name : category})
        .then(category => {
            if(category){
                subcategoryid = category.subcategoriesid;
                console.log(subcategoryid);
            }else{
                res.status(200).send('Category dont have sub categories');
            }
        });
    console.log(subcategoryid);    
    SubCategory.findOne({_id : subcategoryid})
        .then(subcategory => {
            if(subcategory){
                res.status(200).json(subcategory);
            }else{
                res.status(200).send('no sub catrcories found');
            }
        });

});



module.exports = router;