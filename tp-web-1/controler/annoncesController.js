const Annonce = require("../models/annonces");
const moment = require("moment");
const mongoose = require("mongoose");
const getAllAnnonces = async (req, res, next) => {
  try {
    const annonces = await Annonce.find({
      statusPublication: "Publiée",
    }).exec(); // Utilisez .exec() pour exécuter la requête

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

  // You can access the array of uploaded files using req.files
  const photos = req.files.map((file) => file.filename);

  // Créer un objet Annonce
  const annonce = new Annonce({
    titre: req.body.titre,
    type: req.body.type,
    statusPublication: req.body.statusPublication,
    statusBien: req.body.statusBien,
    descriptionLongue: req.body.descriptionLongue,
    prix: req.body.prix,
    dateDisponibilite: req.body.dateDisponibilite,
    photos: photos,
    agent_immobilier: req.user._id,
  });

  // Enregistrer l'objet dans la base de données
  annonce
    .save()
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Une erreur s'est produite lors de la création de l'annonce : " +
          err.message,
      });
    });
};

//add form
const addForm = (req, res, next) => {
  if (
    req.session.passport === undefined ||
    req.session.passport.isAdmin === false
  )
    res.redirect("/login");
  else {
    console.log(req.session.passport.isAdmin);
    res.render("add", {
      title: "Add a Listing",
      isAdmin: req.user ? req.user.isAdmin : undefined,
    });
  }
};

const getAnnonceInfo = async (req, res, next) => {
  const annonceId = req.params.id;

  try {
    const annonce = await Annonce.findById(annonceId)
      .populate("agent_immobilier")
      .exec();

    if (!annonce) {
      return res.status(404).send("Aucune annonce trouvée avec cet ID");
    }

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

const supprimerAnnonces = async (req, res, next) => {
  const annonceId = req.params.id;

  try {
    const annonce = await Annonce.findByIdAndDelete(annonceId).exec();

    if (!annonce) {
      return res.status(404).send("Aucune annonce trouvée avec cet ID");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Erreur lors de la suppression de l'annonce :", err);
    return next(err);
  }
};

const edit = (req, res) => {
  const id = req.params.id;
  Annonce.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Annnonce with id " + id });
      else {
        res.render("update", {
          data: data,
          title: "Edit listing",
          isAdmin: req.user ? req.user.isAdmin : undefined,
          date: moment(data.dateDisponibilite).format("YYYY-MM-DD"),
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Annonce with id=" + id });
    });
};

const update = (req, res, next) => {
  const id = req.params.id;

  // Fetch the existing Annonce by ID
  Annonce.findById(id)
    .then((existingAnnonce) => {
      if (!existingAnnonce) {
        return res.status(404).send({
          message: `Cannot update Annonce with id=${id}. Annonce not found!`,
        });
      }

      // Extract the existing photos
      const existingPhotos = existingAnnonce.photos || [];

      // Extract the new photos from the uploaded files
      const newImages = req.files.map((file) => file.filename); // Assuming the filenames are stored in the 'filename' property

      // Combine the existing and new photos
      const updatedPhotos = existingPhotos.concat(newImages);

      // Create an object with the fields you want to update, including 'images'
      const updatedData = {
        ...req.body, // Include any other fields you want to update
        photos: updatedPhotos,
      };

      // Update the Annonce with the combined photos
      Annonce.findByIdAndUpdate(id, updatedData, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            return res.status(404).send({
              message: `Cannot update Annonce with id=${id}. Annonce not found!`,
            });
          }
          console.log("Annonce updated successfully:", data);
          res.redirect("/annonces/" + id);
        })
        .catch((err) => {
          // Handle errors
          console.error("Error updating Annonce:", err);
          res.status(500).send({
            message: "Error updating Annonce",
          });
        });
    })
    .catch((err) => {
      // Handle errors related to fetching the existing Annonce
      console.error("Error fetching Annonce:", err);
      res.status(500).send({
        message: "Error fetching Annonce",
      });
    });
};

const poserQuestion = (req, res, next) => {
  const annonceId = req.params.id;
  const userId = req.user._id;
  const userName = req.user.username;
  const { question } = req.body;
  console.log("lerni");
  console.log(req.user);

  // Créez un objet question
  const nouvelleQuestion = {
    _id: new mongoose.Types.ObjectId(),
    utilisateur_id: userId,
    utilisateur_username: userName,
    question: question,
    date: new Date(),
    reponses: [], // Initialisez le tableau de réponses à vide
  };

  // Trouvez l'annonce par son ID
  Annonce.findById(annonceId)
    .then((annonce) => {
      if (!annonce) {
        return res.status(404).json({ message: "Annonce introuvable" });
      }

      // Ajoutez la nouvelle question au tableau de questions de l'annonce
      annonce.questions.push(nouvelleQuestion);

      // Sauvegardez l'annonce mise à jour dans la base de données
      return annonce.save();
    })
    .then(() => {
      res.redirect("/annonces/" + annonceId);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de l'ajout de la question",
      });
    });
};

const repondreQuestion = (req, res, next) => {
  const { annonceId, reponse } = req.body;
  const questionId = req.params.id;

  Annonce.findById(annonceId)
    .then((annonce) => {
      if (!annonce) {
        return res.status(404).json({ message: "Annonce introuvable" });
      }

      // Trouvez la question par son ID
      const question = annonce.questions.find(
        (question) => question._id.toString() === questionId
      );

      if (!question) {
        return res.status(404).json({ message: "Question introuvable" });
      }

      // Créez un objet réponse
      const nouvelleReponse = {
        question_id: questionId,
        agent_immobilier_id: req.user.id,
        agent_immobilier_username: req.user.username,
        reponse: reponse,
        date: new Date(),
      };

      // Ajoutez la nouvelle réponse au tableau de réponses de la question
      question.reponses.push(nouvelleReponse);

      // Sauvegardez l'annonce mise à jour dans la base de données
      return annonce.save();
    })
    .then(() => {
      res.redirect("/annonces/" + annonceId);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Une erreur s'est produite lors de l'ajout de la réponse",
      });
    });
};

const getMesAnnonces = async (req, res, next) => {
  try {
    console.log("lerbi");
    console.log(req.user._id);
    const annonces = await Annonce.find({
      agent_immobilier: req.user._id,
    }).exec();

    res.render("MesAnnonces", {
      title: "Mes Annonces",
      annonces: annonces,
      isAdmin: req.user ? req.user.isAdmin : undefined,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des annonces :", err);
    return next(err);
  }
};

module.exports = {
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
};
