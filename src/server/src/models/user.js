const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    email: {type: String, required: true, unique: true, trim: true},
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true, trim: true},
    accessKey: {type: String, required: true, trim: true, index: {
        unique: true, // allow duplicate null values
        partialFilterExpression: {accessKey: {$type: 'string'}}
    }}
});

module.exports.User = mongoose.model('User', userScheme, 'users');
