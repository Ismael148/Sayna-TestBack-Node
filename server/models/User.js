const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Collections to MongoDB
let userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_naissance: {
        type: Date,
        required: true
    },
    sexe: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema);