const localstartegy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');
const jwtSecret     = require('../config/jwtConfig');
const jwt           = require('jsonwebtoken');

//load user model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new localstartegy({usernameField : 'email'} , (email, password, done) => {
            //chack if email is registered
            User.findOne({ email:email })
                .then(user => {
                    if(!user){
                        return done(null,false,{message : 'the email is not registered'});
                    }

                    //chack if the passwords matches
                    bcrypt.compare(password, user.password, (err,ismatch)=> {
                        if(err) throw err;

                        if(ismatch){
                            const token = jwt.sign({ id: user.email }, jwtSecret.secret);
                            return done(null, user,{
                                auth: true,
                                token: token,
                                message: 'user found & logged in',
                            });    
                        }else{
                            return done(null, false, {message : 'incorrect password'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}