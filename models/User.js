const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    moveList: Array
});

module.exports = mongoose.model('User', UserSchema);