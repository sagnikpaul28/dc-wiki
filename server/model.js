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
    }
});


const Heroes = mongoose.model('hero', heroesSchema);
module.exports = Heroes;