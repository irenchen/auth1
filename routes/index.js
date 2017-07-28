var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.render('index', { user: req.user });
  } else {
    res.render('login');
  }
});

router.get('/login', (req, res, next) => {
  var errors = req.flash('error');
  res.render('login', { errors: errors});
});

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true,
// }));

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err) return res.send('database error');
    if(!user) return res.send('login info error');
    req.logIn(user, function(err) {
      if(err) return res.send('session error');
      res.send('success user email : ' + user.email);
    });
  })(req, res);
});

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
