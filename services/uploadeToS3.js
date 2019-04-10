const multer    = require('multer');
const moment    = require('moment');
const multerS3  = require('multer-s3');
const aws       = require('aws-sdk');
const keys      = require('../config/awskeys');




aws.config.update({
    secretAccessKey: keys.AWS_SEC_KEY,
    accessKeyId: keys.AWS_ACC_KEY,
    region: 'us-east-1' // region of your bucket
});

const s3 = new aws.S3();

const storage = multerS3({
    s3: s3,
    bucket: 'lns-pic-storage',
    acl: 'public-read',
    limits      : {fileSize : 1024*1024*2},
    fileFilter  : filter,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+file.originalname)
    }
  })

// validate file type
const filter = (req , file , cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/pdf'){
        cb(null , true);
    }else{
        cb(new Error('file type error') , false);
    }
};

const upload = multer({
    storage     : storage, 
    //limiting uploading Image size to 2 mb
    limits      : {fileSize : 1024*1024*2},
    fileFilter  : filter
});

module.exports = upload;