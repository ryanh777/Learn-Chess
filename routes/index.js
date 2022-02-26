const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    // console.log("index:", req.headers)

    res.status(200).send("Hey hey hey, it's fat albert.")
})

module.exports = router;