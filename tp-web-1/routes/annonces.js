var express = require("express");
var router = express.Router();
var { checkIfAuthenticated } = require("../controler/authControler");
var {
  getAllAnnonces,
  createAnnonce,
  getAnnonceInfo,
  supprimerAnnonces,
  addForm,
} = require("../controler/annoncesController");
const annonces = require("../models/annonces");

/* all annonces . */
router.get("/", getAllAnnonces);

/* Crée une annonce*/
router.get("/add", addForm);

router.post("/annonces/add", createAnnonce);

router.get("/annonces/:id", getAnnonceInfo);

router.get("/delete/:id", supprimerAnnonces);

module.exports = router;
