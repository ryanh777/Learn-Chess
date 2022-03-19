const number = require('@hapi/joi/lib/types/number');
const mongoose = require('mongoose');

const MoveSchema = mongoose.Schema({
    move: {
        type: String,
        required: true
    },
    parentID: {
        type: String,
        required: true
    },
    childIDs: [String],
    childMoves: [String]
});

module.exports = mongoose.model('Move', MoveSchema); 