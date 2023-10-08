const connectDB = require("../config/connectionDb");
const Annonce = require("../models/annonces");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const mocha = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app"); // Replace with the actual path to your Express app
const User = require("../models/user"); // Import your User model
const passport = require("passport");

// une annonce qui sert de test
let annonceId = "651db12b200095da60152bfa";
// stocker l'annonce de la base de données
let annonceFromDB;
describe("la génération de pages web à partir du contenu de la base de données", () => {
  let browser;
  let page;

  before(async () => {
    await connectDB();
    browser = await puppeteer.launch();
    page = await browser.newPage();
    // Récupérez l'annonce de la base de données avec '_id' spécifié
    annonceFromDB = await Annonce.findById(annonceId);
  });

  after(async () => {
    await browser.close();
  });

  it("Devrait selectionner le titre de l'annonce et le comparer avec la base de donnée ", async () => {
    // Aller sur la page http://localhost:3000/annonces/annonceId
    await page.goto("http://localhost:3000/annonces/" + annonceId);

    // Extraire le titre de l'annonce en
    const annonceTitreElement = await page.$(`#annonce-titre`);
    const annonceTitre = await page.evaluate(
      (element) => element.textContent,
      annonceTitreElement
    );

    // Comparer le titre de l'annonce avec celui de la base de données
    if (annonceTitre === annonceFromDB.titre) {
      console.log(
        `Le titre de l'annonce "${annonceTitre}" correspond à celui de la base de données.`
      );
    } else {
      console.log(
        `Le titre de l'annonce "${annonceTitre}" ne correspond pas à celui de la base de données.`
      );
    }
  });
});

describe("Register", () => {
  it("Créer nouveau utilisateur", (done) => {
    request(app)
      .post("/register")
      .send({
        firstName: "id",
        lastName: "ilyass",
        phone: "064655555",
        username: "id_ilyass",
        password: "145236",
        isAdmin: true,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        User.find({ username: "id_ilyass" })
          .countDocuments()
          .then((count) => {
            expect(count).to.equal(1);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe("Login", () => {
  it("les informations d'authentification sont correctes", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "oualid",
        password: "1456",
      })
      .expect(302) // Expect a redirect response (302 Found)
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("informations d'identification erronées", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "wrong",
        password: "wrong",
      })
      .expect(302)
      .expect("Location", "/login?error=Invalid%20username%20or%20password")
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
