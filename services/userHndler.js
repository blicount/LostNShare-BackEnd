const User     = require('../models/User');
const moment    = require('moment');

module.exports = {

checkIfManger : function checkIfManger(email){
    return new Promise((resolve , reject) => {
        User.findOne({email : email})
            .then(user => {
                if(user){
                    if(user.ismanager === 1 ){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }else{
                    resolve(false);;
                }
            })
            .catch(err => reject(err))
    });
}

}