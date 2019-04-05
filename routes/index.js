const express = require('express');
const router = express.Router();
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');

//home page
router.get('/', (req,res) =>{
    res.redirect('https://lost-n-share.herokuapp.com/');
});

//logged in page
router.get('/dashboard',ensureAuthenticated ,(req,res) =>
    res.render('dashboard',{name : req.user.name}
));

module.exports = router;