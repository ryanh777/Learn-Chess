const express = require('express')
const router = express.Router();
const Person = require('../models/Person');

router.get('/', async (req, res) => {
    // console.log("api:", req.headers)
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.json(err);
    }
});

router.post('/', async (req, res) => {
    const post = new Person({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    try {
        const savedPerson = await post.save();
        res.json(savedPerson);
    } catch (err) {
        res.json(err)
    }
});

module.exports = router;