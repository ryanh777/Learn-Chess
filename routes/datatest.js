const express = require('express')
const router = express.Router();
const Person = require('../models/Person');

router.get('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        res.json(person);
    } catch (err) {
        res.json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removedPerson = await Person.remove({ _id: req.params.id });
        res.json(removedPerson);
    } catch (err) {
        res.json(err);
    }
});

router.post('/', async (req, res) => {
    const person = new Person({
        name: req.body.name,
        parentID: req.body.parentID
    });

    try {
        const savedPerson = await person.save();
        res.json(savedPerson._id);
    } catch (err) {
        res.json(err)
    }
});

router.patch('/add/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.updateOne(
            { _id: req.params.id },
            { $push: { childID: req.body.id, childName: req.body.name } }
        );
        res.json(updatedPerson);
    } catch (err) {
        res.json(err)
    } 
})

router.patch('/remove/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.updateOne(
            { _id: req.params.id },
            { $pull: { childID: req.body.id, childName: req.body.name } }
        );
        res.json(updatedPerson);
    } catch (err) {
        res.json(err)
    } 
})

module.exports = router;