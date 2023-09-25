var express = require('express');
var router = express.Router();
var user = require('../models/user');
var passport= require('passport');
var {redirectIfAuthenticated} = require('../controler/authControler')


router.post('/', passport.authenticate('local'), function(req, res) {

    req.session.save((err) => {
        if (err) return res.render('/login');
        req.session.passport.idUtilisateur = req.user._id;
        req.session.passport.admin =req.user.isAdmin;

        res.redirect('/');
    });

});

router.get('/', redirectIfAuthenticated ,function(req, res) {
    res.render('login', {user: req.user});
});

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err)  return next(err);
        res.redirect('/');
    });
});


module.exports = router;
