var express = require("express");
var router = express.Router();

const Annonce = require("../models/annonces");

var { checkIfAuthenticated } = require("../controler/authControler");
var {
  getAllAnnonces,
  createAnnonce,
  getAnnonceInfo,
  supprimerAnnonces,
  addForm,
  edit,
  update,
} = require("../controler/annoncesController");
const annonces = require("../models/annonces");

/* all annonces . */
router.get("/", getAllAnnonces);

/* Crée une annonce*/
router.get("/annonces/add", addForm);

router.post("/annonces/add", createAnnonce);

router.get("/annonces/:id", getAnnonceInfo);

router.get("/delete/:id", supprimerAnnonces);

router.get("/annonces/update/:id", checkIfAuthenticated, edit);

router.post("/annonces/update/:id", update);

module.exports = router;
