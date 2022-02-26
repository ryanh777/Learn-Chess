const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
require('dotenv/config')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// app.use('/', require('./routes/index'))
app.use('/api', require('./routes/api'))

mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    // app.get("*", (req, res) => {
    //     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    // });
}

app.listen(PORT, () => console.log('Server started on port', PORT))