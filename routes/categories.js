const express       = require('express');
const router        = express.Router();
const Category      = require('../models/Category'); 
const SubCategory   = require('../models/SubCategory');

function getSubCtegoryid(category){
    return new Promise( (resolve,reject) => {
        Category.findOne({name : category})
            .then(cat => {
                if(cat){
                    resolve(cat.subcategoriesid);                
                }else{
                    reject('no catgory found');
                }
            })
            .catch(err => reject(err));                 
    });    
}


//get all categories
router.get('/getAllCategories/', (req,res) => {
    Category.find()
        .then(category => {
            if(category.length > 0){
                res.status(200).json(category);
            }else{
                res.status(200).send('category no found');
            }
        });
});

//insert new category(manger)

router.post('/insertCategory/' , (req,res) =>{
        const category = req.body.category;
        const subcategory = req.body.subcategory;
        let newsubcategory = new SubCategory({
            subcategorylist : subcategory
        });

        newsubcategory.save()
            .then( subcat => {
                if(subcat){
                    let newcategory = new Category({
                        name : category,
                        subcategoriesid: subcat._id
                    });
                    console.log(newcategory);
                    newcategory.save()
                        .then(cat => {
                            if(cat)
                                res.status(200).send('category created seccessfully');
                            else
                                res.status(200).send('create category failed new catgory seve empty');
                        })
                        .catch(err => res.status(200).send('create category failed save ctegory failed'))
                }else{
                    res.status(200).send('create category failed new subcatgory seve empty');
                }     
            })
            .catch( err =>  res.status(200).send('create category failed'))     
});

//insert new sub category to exsist category(manger)

router.post('/insertSubCategory' , async (req,res) => {
    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let subcategoryid;
    try{
    subcategoryid = await getSubCtegoryid(category);
    }
    catch(e){
        res.status(200).send(`category careation failed ----- ${e} return from getSubCtegoryid method `);  
    }
    SubCategory.updateOne({_id : subcategoryid},{$push: {subcategorylist: {$each: subcategory }}})
        .then(subcat=>{
            if(subcat){
                res.status(200).send('subcategory added seccessfully');
            }else
                 res.status(200).send('category careation failed something want wrang with subcategory update');
        })
        .catch(err=> console.log(err))//res.status(200).send('category careation failed'))

});

//delete category
router.post('/DeleteCategory' , (req,res) => {
    let id = req.body.id;
    /*
    if(!user.ismanager)
        res.status(200).send('user dont have permission to delete');
    */
    Category.findOne({_id : id})
        .then(cat =>  {
            SubCategory.deleteOne({_id : cat.subcategoriesid})
                .then(subcat => {
                    if(subcat.deletedCount){
                        Category.deleteOne({_id : id})
                            .then(cat => {
                                if(cat.deletedCount)
                                    res.status(200).send('Category and SubCategory deleted');
                                res.status(200).send('Category was not found');
                            })
                            .catch(err => res.status(200).send( `error in delete() ${err}`))
                    }else{
                        res.status(200).send(`can't delete sub category attach to category` )
                    }
                })
                .catch(err => res.status(200).send( `error in subcategory delete() ${err}`))
        })
    
});

module.exports = router;

