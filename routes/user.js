const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const userValidation = require('../validation')
const verify = require('./verifyToken')
const router = express.Router();

router.get('/', verify, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id});
        res.json(user);
    } catch (err) {
        res.json(err);
    }
});

router.post('/register', async (req, res) => {

    const { error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const userExist = await User.findOne({username: req.body.username})
    if (userExist) return res.status(400).send('Username already exists')

    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPass
        });
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err)
    }
});

router.post('/login', async (req, res) => {
    const { error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({username: req.body.username})
    if (!user) return res.status(400).send('Could not find username')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    const token = jwt.sign({ _id: user._id}, process.env.SECRET_TOKEN)
    res.header('auth-token', token).send(token)
});

// TODO
router.patch('/:username', verify, async (req, res) => {
    try {
        const updatedPost = await User.updateOne(
            { username: req.params.username },
            { $set: { moveList: req.body.moveList } }
        );
        res.json(updatedPost);
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;