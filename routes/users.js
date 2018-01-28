const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mailer = require('../misc/mailer');
const randomstring = require('randomstring')
// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    console.log(errors);
    res.render('register', {
      errors: errors
    });
    return;
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password,
      active: false
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        var activation_key  = randomstring.generate(8)
        newUser.activation_key = activation_key;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            // req.flash('success','You are now registered and can log in');
            const html = "Hi there, <br/> Thank you for registering! <br/><br/> Please verify your email by typing the following token:<br/>Token: <b>"+ activation_key+ "</b><br/>On the following page:<a href='http://localhost:3012/users/activation'>http://localhost:3012/users/activation</a><br/><br/>Have a pleasant day." 
            mailer.sendEmail('admin@codeworkrsite.com', email, 'Please verify your email!', html);
            req.flash('success', 'Please check your email for account verfication');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

router.get('/login2', function(req, res){
  res.render('login2');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/activation',function(req, res){
  res.render('activation');
});

router.post('/activation',function(req, res){
  email = req.body.email;
  activation_key = req.body.activation_key;
  let query = {email: email};
  User.findOne(query, function(err, user){
    if (!user) {
      req.flash('error', 'No user found.');
      res.redirect('/users/activation');
      return;
    }
    if(user.activation_key == activation_key){
      user.active = true;
      user.save();
      req.flash('success', 'Congrats !! Your email is activated');
    }
    else {
      req.flash('error', 'Activation key did not matched');
    }
    res.redirect('/users/login');
  });
});
module.exports = router;


// notes
// 1- A salt is random text added to the string to be hashed. For example, you don't hash my_secret_password; you hash something like 1jfSLKe$*@SL$#)(Sslkfs$34:my_secret_password
// 2- The salt is being stored as part of the hash.
// 3- With "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing te cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing.
// 4- The salt is a random value, and should differ for each calculation, so the result should hardly ever be the same, even for equal passwords.
// 5- The salt is usually included in the resulting hash-string in readable form. So with storing the hash-string you also store the salt.
