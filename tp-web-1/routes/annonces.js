var express = require("express");
var router = express.Router();
var { checkIfAuthenticated } = require("../controler/authControler");
var {
  getAllAnnonces,
  createAnnonce,
  getAnnonceInfo,
  supprimerAnnonces,
} = require("../controler/annoncesController");
const annonces = require("../models/annonces");

/* all annonces . */
router.get("/", getAllAnnonces);

/* Crée une annonce*/
router.get("/add", function (req, res) {
  if (
    req.session.passport === undefined ||
    req.session.passport.isAdmin === false
  )
    res.redirect("/");
  else {
    console.log(req.session.passport.isAdmin);
    res.render("add", {
      title: "Add a Listing",
      isAdmin: req.user ? req.user.isAdmin : undefined,
    });
  }
});

router.post("/annonces/add", createAnnonce);

router.get("/annonces/:id", getAnnonceInfo);

router.get("/delete/:id", supprimerAnnonces);

module.exports = router;
