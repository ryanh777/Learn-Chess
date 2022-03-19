const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentID: {
        type: String,
        required: true
    },
    childID: [String],
    childName: [String] 
})

module.exports = mongoose.model('Person', PersonSchema)