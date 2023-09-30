var express = require('express');
var router = express.Router();
var {checkIfAuthenticated}= require('../controler/authControler');
var {getAllAnnonces, getAnnonceInfo} =require('../controler/annoncesController')


/* all annonces . */
router.get('/', getAllAnnonces);


router.get('/annonces/:id', getAnnonceInfo);


module.exports = router;
