
const Annonce = require('../models/annonces'); 

const getAllAnnonces = async (req, res, next) => {
    try {
        const annonces = await Annonce.find({}).exec(); // Utilisez .exec() pour exécuter la requête
    
        console.log('Annonces Récupérées : ', annonces)
        res.render('annonces', { title: 'Annonces', annonces: annonces });
      } catch (err) {
        console.error('Erreur lors de la récupération des annonces :', err);
        return next(err);
      }
};

module.exports = {
    getAllAnnonces
};