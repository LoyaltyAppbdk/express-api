const express = require('express');
const baseHeader = require('../constants/baseHeader');
const generateUUID = require("../helpers/uuidGenerator.js");

const { writeDb, queryDbStatic } = require('../db.js');
const { generateAccessToken, verifyAccessToken } = require('../helpers/jwtUtil.js');
const { authenticateToken } = require('../middlewares/jwtMiddleware.js');

var router = express.Router();

// Create user request

/* POST user */
/* Sets in the DB a new user*/
/* ReqFields: PN, email, PW, user type*/
router.post('register/', async function(req, res) {
    let userId = generateUUID();
    let jwt = generateAccessToken(userId, req.header['phone']);

    // !!! validate that the phone number doesn't exist
    
    const user = {
        [userId]: {
            id: generateUUID(),
            phone: req.header['phone'],
            pw: req.header['pw'],
            first: req.header['firstName'],
            last: req.header['lastName'],
            userRestaurants: [],
            jwt: jwt,
            type: "Customer"
        }
    }

    // Save "user" obj in database here
    await writeDb(`users/`, user);
    await writeDb('usersPN/', req.header['phone']);

    // This is what's returned to be used for the frontend as well as for authentication
    const frontUser = {
        [userId]: {
        first: user['first'],
        last: user['last'],
        id: user['id'],
        jwt: jwt
        }
    }

    return frontUser
});

/* TODO: Add a history of accepted */
module.exports = router;
