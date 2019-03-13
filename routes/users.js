const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/User'); 
const bcrypt    = require('bcryptjs');
const path = require('path');

//login page
router.get('/login', (req,res) =>{
    console.log('got to /login');
    res.status(200).json('got to the http://exmple.com/users/login route');
    //res.redirect('http://exmple.com/users/login');
});

//register
router.get('/register', (req,res) => {
    console.log('got to /register');
    res.status(200).json('got to the http://exmple.com/users/register route');
    //res.redirect('http://exmple.com/users/register');
    });

//hendel register
router.post('/register', (req,res) => {
    const {name, email, password, password2 } = req.body;
    let answer = {};
    let errors = [];

    //validate fields
    if( !name || !email || !password || !password2)
        errors.push('please fill all the fields');
    
    //check password match
    if(password !== password2)
        errors.push('passwords do not match');
        
    //check password length    
    if(password.length < 5)
        errors.push('password must be at least 5 charecters');

    //validetion fail
    if(errors.length > 0){
        answer.status = 'fail';
        answer.err =  errors;
        console.log(answer);
        res.status(200).json(answer);
    }
    //validetion passes
    else{
        User.findOne({email : email })
            .then(user =>{
                if(user){
                    // email exist
                    errors.push('email allredy registerd');
                    answer.status = 'fail';
                    answer.err =  errors;
                    console.log(answer);
                    res.status(200).json(answer);
                }
                else{
                    let newuser = new User({
                        name : name,
                        email : email,
                        password : password
                    });
                    console.log(newuser);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newuser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newuser.password = hash;
                          newuser.save()
                            .then(user => {
                                answer.status = 'success';
                                answer.message = 'user is add successfuly';
                                res.status(200).json(answer);
                            })
                            .catch(err => res.status(200).json(err));
                        });
                      });    

                }
            });
    }

});

//login handel


router.post('/login',
passport.authenticate('local'), 
(req,res) => {
    let answer = {};
    answer.status = 'succsess';
    answer.user = req.user;
    res.status(200).json(answer);  
});
/*
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});*/

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://exmple.com');
  });
module.exports = router;