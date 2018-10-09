const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heroesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    accentColor: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    description: {
        type: String
    },
    byLine: {
        type: String
    },
    powers: {
        type: String
    },
    firstAppearance: {
        type: String
    },
    relatedCharacters: {
        type: String
    }
});


const Heroes = mongoose.model('hero', heroesSchema);
module.exports = Heroes;