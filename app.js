const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
mongoose.connect(config.database);
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'be happy',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.post('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

let users = require('./routes/users');
app.use('/users', users);

let Note = require('./models/note');
app.get('/', function(req, res){
  if(req.user) {
    //Demostrating the use of User model instance method
    req.user.get_user_name();
    Note.find({author: req.user._id}, function(err, notes){
      if(err){
        console.log(err);
      } 
      else {
        res.render('index', {
          title:'Notes',
          notes: notes
        });
      }
    });
  } else {
    res.render('index', {
      title:'Notes',
      notes: ""
    });
  }
  
});
let notes = require('./routes/notes');
app.use('/notes', notes);

const Port = require('./config/port')
app.listen(Port, function(){
  console.log('Server started on ' + Port);
});

//Demostrating the use of User model static method
const User = require('./models/user');
User.user_count();

