var express = require('express');
var router = express.Router();
var {checkIfAuthenticated}= require('../controler/authControler');

/* all annonces . */
router.get('/', checkIfAuthenticated, function(req, res, next) {

    // TODO : get all annonces from database 

    
    res.render('annonces', { title: 'Anonnces : ' + req.user.username, admin: req.user.isAdmin });
});


module.exports = router;
