const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        // const query = {};
        // const result = await bikePartCollection.find(query).toArray()
        // res.send(result)
        res.send('parts found')
    })
    .post((req, res) => {
        // const filter = req.body;
        // const result = await bikePartCollection.insertOne(filter)
        // res.send(result)
        res.send('parts added')
    });

router.route('/:id')
    .get((req, res) => {
        res.send('parts found with id')
    })

module.exports = router;



// const express = require("express");
// const router = express.Router();

router.route('/')
    .get((req, res) => {
        // const query = {};
        // const result = await bikePartCollection.find(query).toArray()
        // res.send(result)
        res.send('parts found')
    })
    .post((req, res) => {
        // const filter = req.body;
        // const result = await bikePartCollection.insertOne(filter)
        // res.send(result)
        res.send('parts added')
    })