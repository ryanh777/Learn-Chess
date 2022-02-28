const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    movesList: []
});

module.exports = mongoose.model('User', UserSchema);