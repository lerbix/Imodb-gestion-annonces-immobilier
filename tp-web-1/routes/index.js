var express = require('express');
var router = express.Router();
var {checkIfAuthenticated}= require('../controler/authControler');

/* GET home page. */
router.get('/', checkIfAuthenticated, function(req, res, next) {
  res.render('index', { title: req.user.username, admin: req.user.isAdmin });
});


module.exports = router;
