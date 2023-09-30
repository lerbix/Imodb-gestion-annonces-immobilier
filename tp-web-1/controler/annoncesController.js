const Annonce = require("../models/annonces");

const getAllAnnonces = async (req, res, next) => {
  try {
    const annonces = await Annonce.find({}).exec(); // Utilisez .exec() pour exécuter la requête

    res.render("annonces", {
      title: "Annonces",
      annonces: annonces,
      isAdmin: req.user ? req.user.isAdmin : undefined,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des annonces :", err);
    return next(err);
  }
};

// Crée une nouvelle annonce
const createAnnonce = (req, res, next) => {
  // Valider la requête
  if (
    !req.body.titre ||
    !req.body.type ||
    !req.body.statusPublication ||
    !req.body.statusBien ||
    !req.body.descriptionLongue ||
    !req.body.prix ||
    !req.body.dateDisponibilite
  ) {
    return res
      .status(400)
      .send({ message: "Tous les champs doivent être remplis !" });
  }

  // Créer un objet Annonce
  const annonce = new Annonce({
    titre: req.body.titre,
    type: req.body.type,
    statusPublication: req.body.statusPublication,
    statusBien: req.body.statusBien,
    descriptionLongue: req.body.descriptionLongue,
    prix: req.body.prix,
    dateDisponibilite: req.body.dateDisponibilite,
    photos: "hero.jpg",
  });

  // Enregistrer l'objet dans la base de données
  annonce
    .save()
    .then((data) => {
      res.redirect("/annonces");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Une erreur s'est produite lors de la création de l'annonce : " +
          err.message,
      });
    });
};

const getAnnonceInfo = async (req, res, next) => {
  const annonceId = req.params.id;

  try {
    // Utilisez Mongoose pour rechercher l'annonce par son ID
    const annonce = await Annonce.findById(annonceId).exec();

    if (!annonce) {
      return res.status(404).send("Aucune annonce trouvée avec cet ID");
    }

    console.log(annonce);
    // Si une annonce est trouvée, vous pouvez renvoyer les détails de l'annonce à la vue
    res.render("annonceInformations", {
      title: "Détails de l'annonce",
      annonce: annonce,
      isAdmin: req.user ? req.user.isAdmin : undefined,
    });
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des détails de l'annonce :",
      err
    );
    return next(err);
  }
};

module.exports = {
  getAllAnnonces,
  createAnnonce,
  getAnnonceInfo,
};
