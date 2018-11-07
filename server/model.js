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
    wallpaperUrl: {
        type: String,
        required: true
    },
    accentColor: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    byLine: {
        type: String,
        required: true
    },
    powers: {
        type: String,
        required: true
    },
    firstAppearance: {
        type: String,
        required: true
    },
    relatedCharacters: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});


const Heroes = mongoose.model('hero', heroesSchema);
module.exports = Heroes;