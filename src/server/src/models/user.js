const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    accessKey: {type: String, unique: true}
});

module.exports.User = mongoose.model('User', userScheme, 'users');
