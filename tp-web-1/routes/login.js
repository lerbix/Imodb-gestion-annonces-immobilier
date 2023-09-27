var express = require('express');
var router = express.Router();
var user = require('../models/user');
var passport= require('passport');
var {redirectIfAuthenticated} = require('../controler/authControler')


router.post('/', passport.authenticate('local'), function(req, res) {
    // Check for authentication errors
  if (!req.user) {
    // Handle non-existent user or incorrect password
    return res.redirect('/login?error=Invalid%20username%20or%20password');
  }
    req.session.save((err) => {
        if (err) return res.render('/login');
        req.session.passport.idUtilisateur = req.user._id;
        req.session.passport.admin =req.user.isAdmin;

        res.redirect('/');
    });

});

router.get('/', redirectIfAuthenticated, function (req, res) {
    const error = req.query.error;
    res.render('login', { error, user: req.user });
  });
  

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err)  return next(err);
        res.redirect('/');
    });
});


module.exports = router;
