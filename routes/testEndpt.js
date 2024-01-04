const express = require('express');
const generateUUID = require("../controllers/uuidGenerator.js");
const { writeDb, queryDbStatic } = require('../db.js')

var router = express.Router();

// router.get('/postTest', async (req, res) => {
//     writeDb('new', {wow: 'wow'})
// })

async function getHistory () {
    const userId = "3323-1sf2-oupq-01pb";
    const restaurantId = "ra";
    let returnHistory;

    try {
        returnHistory = await queryDbStatic(`userTransactions/${userId}`, restaurantId, false, []);
        console.log(returnHistory);
    } catch (error) {
        console.log(error)
    }
}

getHistory();