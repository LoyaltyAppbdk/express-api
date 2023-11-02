const express = require('express');
const baseHeader = require('../constants/baseHeader');
const generateUUID = require("../controllers/uuidGenerator");

var router = express.Router();
/* GET restaurants queue */
/* Returns: list of users */
/* In list of users, we have the visits and threshold OR the item, as well as their name*/
router.get('my-business/', function(req, res) {
    let user = req['user']
})

// Create user request

/* POST user */
/* Sets in the DB a new user*/
/* ReqFields: PN, email, PW, user type*/
router.post('new-user/', function(req, res) {
    let user = {
        first: req['firstName'],
        last: req['lastName'],
        id: generateUUID(),
        phone: req['phone'],
        pw: req['pw'],
        userRestaurants: [] // Set to UserRestaurants type
        //do we store jwt here?
    }

    // Save "user" obj in database here

    // generate JWT token

    // This is what's returned to be used for the frontend as well as for authentication
    let frontUser = {
        first: user['first'],
        last: user['last'],
        id: user['id'],
        jwt: "jwt"
    }

    return frontUser
})

/* TODO Frontend: make a sign-in page for resturant (employee) */

/* FUNC redeem remove */
/* Subtracts threshold amt from user's total visits amt */  
/* Returns confirmation msg */
/* could be just a function */

router.get('/confirmed/', function(req, res) {
    console.log('here')
    res.send("confirmed")
})


/* TODO: Add a history of accepted */
module.exports = router;
