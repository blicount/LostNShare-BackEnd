const express   = require('express');
const router    = express.Router();
const SubCategory      = require('../models/SubCategory'); 
const Category      = require('../models/Category'); 


//get all categorys

router.get('/getAllSubCategoryByCategory/:category', (req,res) => {
    let categoryname = req.params.category;
    console.log(categoryname);
    Category.findOne({name : categoryname})
        .then(category => {
            if(category){  
                console.log(category.subcategoriesid);
                SubCategory.findOne({_id : category.subcategoriesid})
                    .then(subcategory => {
                        if(subcategory){
                            res.status(200).json(subcategory);
                        }else{
                            console.log(subcategory);
                            res.status(200).send('no sub catrcories found');
                        }
                    });
            }else{
                res.status(200).send('Category dont have sub categories');
            }
        });
 

});


module.exports = router;