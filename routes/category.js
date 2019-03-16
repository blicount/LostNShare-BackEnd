const express   = require('express');
const router    = express.Router();
const Category      = require('../models/Category'); 


//get all categorys
router.get('/getAllCategories/', (req,res) => {
    Category.find()
        .then(category => {
            if(category.length > 0){
                res.status(200).json(category);
            }else{
                res.status(200).send('no Items found');
            }
        });
});

module.exports = router;

