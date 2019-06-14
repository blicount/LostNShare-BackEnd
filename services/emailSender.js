const nodemailer = require('nodemailer');
const eventhandler = require('./eventHndler');

module.exports = {

    sendEmail: (emailto,subject,text,itemid)=>{
        return new Promise((resolve,reject)=>{
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lost.and.share.system@gmail.com',
                    pass: 'lost.and.share'
                },
                tls: { rejectUnauthorized: false }
            });

            let mailOptions = {
                from: 'lost.and.share.system@gmail.com',
                to: emailto ,
                subject: subject,
                text: text
            };

            transporter.sendMail(mailOptions, function(error, info){           
                if (error) {
                    reject(error);
                } else {
                    eventhandler.createEvent(itemid,`Email sent to ${emailto} : ${info.response}`);
                    resolve(`Email sent to ${emailto} : ${info.response}`);
                }                
            });
        });    
    }
}