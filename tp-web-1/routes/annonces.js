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
  poserQuestion,
  repondreQuestion,
  getMesAnnonces,
} = require("../controler/annoncesController");
const annonces = require("../models/annonces");

const upload = require("../controler/multerController");

/* all annonces . */
router.get("/", getAllAnnonces);

/* Crée une annonce*/
router.get("/annonces/add", addForm);

router.get("/annonces/mesAnnonces", checkIfAuthenticated, getMesAnnonces);

router.post("/annonces/add", upload, createAnnonce);

router.get("/annonces/:id", getAnnonceInfo);

router.get("/delete/:id", supprimerAnnonces);

router.get("/annonces/update/:id", checkIfAuthenticated, edit);

router.post("/annonces/update/:id", upload, update);

router.post("/annonces/poserQuestion/:id", checkIfAuthenticated, poserQuestion);

router.post(
  "/annonces/repondreQuestion/:id",
  checkIfAuthenticated,
  repondreQuestion
);

router.get("/about", function (req, res, next) {
  res.render("about", {
    title: "About Us",
    isAdmin: req.user ? req.user.isAdmin : undefined,
  });
});

module.exports = router;
