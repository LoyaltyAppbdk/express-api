import express from "express";
var router = express.Router();
/* GET restaurants queue */
/* Returns: list of users */
/* In list of users, we have the visits and threshold OR the item, as well as their name*/
router.get('my-business/', function(req, res) {
    let user = req['user']
})

// Create user request

/* FUNC redeem remove */
/* Subtracts threshold amt from user's total visits amt */  

/* FUNC save to history*/
/* Every request made/reciprocated should be saved in a history section */

/* TODO: Add a history of accepted */
module.exports = router;
