var express = require('express');
var router = express.Router();
var {checkIfAuthenticated}= require('../controler/authControler');
var {getAllAnnonces} =require('../controler/annoncesController')
/* all annonces . */
router.get('/', getAllAnnonces);


module.exports = router;
