const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Person = require('./models/Person');
const path = require('path')
require('dotenv/config')

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            name: 'learnchess',
            version: '0.1.0'
        }
    })
})

app.get('/api', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.json(err);
    }
});

app.post('/api', async (req, res) => {
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

mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"))
    })
}

app.listen(PORT, () => console.log('Server started on port', PORT))