const express       = require('express'),
    events          = require('events'),
    url             = require('url'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    passport        = require('passport'),
    mongoose        = require('mongoose'),
    flash           = require('connect-flash'),
    // categories = require('./controllers/categories.ctl'),
    // group = require('./controllers/group.ctl'),
    // options = require('./controllers/options.ctl'), 
    //users = require('./controllers/users.ctl'),
    app         = express(),
    port        = process.env.PORT || 3000;

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/mgkey').MLAB_KEY;

//conect to mongo
mongoose.connect(db , {useNewUrlParser:true})
    .then(()=> console.log('mongoDB connected'))
    .catch(err => console.log.err);

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/assets', express.static(`${__dirname}/public`));

//express-session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
// Connect flash
app.use(flash());
  
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//ROUTES

app.use('/', require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/items',require('./routes/items'));
app.use('/categories',require('./routes/category'));
app.use('/subcategories',require('./routes/subcategory'));

app.all('*',(req,res) =>{
    res.send('Got lost? This is a friendly 404 page :)');
});


app.listen(port,console.log(`server started on port ${port}`));


 /*"nodemon --watch server --exec babel-node -- server/app.js"*/