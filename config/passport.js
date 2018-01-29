const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy({usernameField: 'name',password: 'password'}, function(username, password, done){
    // Match Username
    let query = {name:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }
      if(!user.active){
        return done(null, false, {message: 'User not activated'});
      }
      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          console.log("1-user is passed")
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, d) {
    d(null, user.id);
  });

  passport.deserializeUser(function(id, d) {
    User.findById(id, function(err, user) {
      d(err, user);
    });
  });
}

// Notes for self learning
// 1- Passport recognizes that each application has unique authentication requirements.  
// 2- Authentication mechanisms, known as strategies, are packaged as individual modules. 
// 3- Applications can choose which strategies to employ, without creating unnecessary dependencies.
// 4- differences between the Local, Basic and Digest strategies in Passport.js are subtle but important. Here's the rundown:
// 5- Passport's local strategy is a simple username and password authentication scheme. It finds a given user's password from the username (or other identifier) and checks to see if they match
// 6-  The main difference between the local strategy and the other two strategies is its use of persistent login sessions
// 7-  If you a using the Passport Local strategy: - a session is established, so you don't have to send creds on each request; - username and password are provided in "username" and "password" headers by default
// 8- If you a using the Passport Basic/Digest strategies: - a session is not used, so you must provide the credentials at every API call; - username and password/hash are contained within "Authorization" header;
// 9- Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to employ.
// 10- By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any additional route handlers will not be invoked. If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
// 11- app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login' }));
// 12 - After successful authentication, Passport will establish a persistent login session. This is useful for the common scenario of users accessing a web application via a browser. However, in some cases, session support is not necessary. For example, API servers typically require credentials to be supplied with each request. When this is the case, session support can be safely disabled by setting the session option to false.


// 13- app.get('/api/users/me',
//   passport.authenticate('basic', { session: false }),
//   function(req, res) {
//     res.json({ id: req.user.id, username: req.user.username });
//   });

// 14- Custom Callback
// If the built-in options are not sufficient for handling an authentication request, a custom callback can be provided to allow the application to handle success or failure.

// 15- app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

// 16- In this example, note that authenticate() is called from within the route handler, rather than being used as route middleware. This gives the callback access to the req and res objects through closure.

// 17- The callback can use the arguments supplied to handle the authentication result as desired. Note that when using a custom callback, it becomes the application's responsibility to establish a session (by calling req.login()) and send a response.