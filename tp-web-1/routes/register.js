var express = require('express');
var router = express.Router();
var user = require('../models/user');
var passport= require('passport');
var {redirectIfAuthenticated} = require('../controler/authControler')


router.get('/', redirectIfAuthenticated,function(req, res) {
    res.render('register', {user: req.user});
});

router.post('/' ,function(req, res) {
    const isAdmin = req.body.isAdmin === 'true';
    
    user.register(new user({username:req.body.username, isAdmin: isAdmin}), req.body.password, function(err, user) {
        if(err)
            return res.render('register', {err: true});

        passport.authenticate('local')(req,res, function (){
            req.session.save(function (err) {
                if (err) return res.render('register', {err: true});
                req.session.passport.userId = req.user._id;
                req.session.passport.admin = isAdmin;
                res.redirect('/');
            });

        });
    });
});


module.exports = router;
