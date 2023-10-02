const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { ObjectId } = mongoose.Types; // Importez ObjectId depuis Mongoose

const annonceSchema = new Schema({
    // un titre
    titre : {
        type: String,
        required: true
    },

    // titre 
    type: {
        type: String,
        enum: ['Vente', 'Location'],
        required: true
    },

    // statut de publication (publiée, non publiée),
    statusPublication: {
        type : String,
        enum : ['Publiée', 'Non publiée'],
        required: true,
    },

    // un statut de bien (disponible, loué, vendu),
    statusBien: {
        type: String,
        enum : ['disponible', 'loué', 'vendu'],
        required : true,
    },

    // une description longue,
    descriptionLongue: {
        type: String,
        required: true,
    }, 

    // un prix (de vente ou de location),
    prix: {
        type: Number,
        required: true,
    },

    // une date de disponibilité,
    dateDisponibilite: {
        type: Date,
        required: true,
    },

    // des photos (éventuellement),
    photos: [{
        type: String,
        required: false,
    }],

    // des questions posées par des utilisateurs,
    questions: [                    
        {
        "_id": ObjectId,              
        "utilisateur_id": ObjectId,
        "utilisateur_username": String,
        "question": String,           
        "date": Date, 
        "reponses": [
            {
                "question_id": ObjectId,            
                "agent_immobilier_id": ObjectId, 
                "agent_immobilier_username": String,
                "reponse": String,            
                "date": Date             
            }
        ],           
        }
    ],


    // des réponses apportées par l’agent immobilier.
    reponses: [                     
        {
        "_id": ObjectId,  
        "question_id": ObjectId,            
        "agent_immobilier_id": ObjectId, 
        "reponse": String,            
        "date": Date                  
        }
    ],
});

module.exports = mongoose.model('annonces', annonceSchema);