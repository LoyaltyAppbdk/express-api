const express = require('express');
const generateUUID = require("../controllers/uuidGenerator.js");
const { writeDb, queryDbStatic } = require('../db.js')

var router = express.Router();

router.get('/postTest', async (req, res) => {
    writeDb('new', {wow: 'wow'})
})