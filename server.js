const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Person = require('./models/Person');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/api', async (req, res) => {
    try {
        const  people = await Person.find();
        res.json(people);
    } catch (err) {
        res.json(err);
    }
});

app.post('/api', async (req, res) => {
    console.log("here")
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

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ryanh777:kaKashi%23Sensei7@chess-test.kcunz.mongodb.net/Chess-Test?retryWrites=true&w=majority')

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}


const PORT = process.end.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port', PORT))