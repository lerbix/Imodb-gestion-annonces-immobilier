
const Annonce = require('../models/annonces'); 

const getAllAnnonces = async (req, res, next) => {
    try {
        const annonces = await Annonce.find({}).exec(); // Utilisez .exec() pour exécuter la requête
    
        res.render('annonces', { title: 'Annonces', annonces: annonces, isAdmin: req.user ? req.user.isAdmin : undefined  });
      } catch (err) {
        console.error('Erreur lors de la récupération des annonces :', err);
        return next(err);
      }
};


const getAnnonceInfo = async (req, res, next)=> {
  const annonceId = req.params.id;
  
  try {
    // Utilisez Mongoose pour rechercher l'annonce par son ID
    const annonce = await Annonce.findById(annonceId).exec();

    if (!annonce) {
      return res.status(404).send('Aucune annonce trouvée avec cet ID');
    }

  
    console.log(annonce)
    // Si une annonce est trouvée, vous pouvez renvoyer les détails de l'annonce à la vue
    res.render('annonceInformations', { 
      title: 'Détails de l\'annonce',
      annonce: annonce,
      isAdmin: req.user ? req.user.isAdmin : undefined
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des détails de l\'annonce :', err);
    return next(err);
  }
}

module.exports = {
    getAllAnnonces,
    getAnnonceInfo
};