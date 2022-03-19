const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
require('dotenv/config')

const app = express();
const PORT = process.env.PORT || 5000;

// Data parsing
app.use(express.json());
app.use(express.urlencoded({
    // Allows nested objects
    extended: true
}));

// Routes
app.use('/user', require('./routes/user'))
app.use('/data', require('./routes/dataStore'))

// Connect to database
mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION)

// Serves the client build folder to server
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log('Server started on port', PORT))