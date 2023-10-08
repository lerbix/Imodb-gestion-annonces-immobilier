const connectDB = require("../config/connectionDb");
const Annonce = require("../models/annonces");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const mocha = require("mocha");

// une annonce qui sert de test
let annonceId = "652009b09cb8f8158e3eb6d6";
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
