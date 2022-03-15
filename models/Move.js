const mongoose = require('mongoose');

const MoveSchema = mongoose.Schema({
    moveName: {
        type: String,
        required: true
    },
    children: this
});

module.exports = mongoose.model('Move', MoveSchema); 