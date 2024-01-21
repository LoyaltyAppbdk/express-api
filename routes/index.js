const express = require('express');
const baseHeader = require('../constants/baseHeader');
const generateUUID = require("../helpers/uuidGenerator.js");

const { writeDb, queryDbStatic } = require('../db.js');
const { generateAccessToken, verifyAccessToken } = require('../helpers/jwtUtil.js');
const { authenticateToken } = require('../middlewares/jwtMiddleware.js');
const { generateHash, verifyHash } = require('../helpers/passwordSecurity.js')
var router = express.Router();

// Create user request

/* POST user */
/* Sets in the DB a new user*/
/* ReqFields: PN, email, PW, user type*/
router.post('register/', async function(req, res) {
    let userId = generateUUID();
    let jwt = generateAccessToken(userId, req.header['phone']);

    // we are generating the hash here and storing it in the database as it would be compromising to store the raw text
    let passwordHash = await generateHash(req.header['pw']);
    // !!! validate that the phone number doesn't exist
    const user = {
        [req.header['phone']]: {
            id: userId,
            phone: req.header['phone'],
            pw: passwordHash,
            first: req.header['firstName'],
            last: req.header['lastName'],
            userRestaurants: [],
            type: "Customer"
        }
    }

    // Save "user" obj in database here
    await writeDb(`users/`, user);
    
    // This is what's returned to be used for the frontend as well as for authentication
    const frontUser = {
        first: user['first'],
        id: userId,
        last: user['last'],
        pn: req.header['phone'],
        type: "Customer",
        jwt: jwt
    }
    res.status(200);
    res.send(frontUser);
});


router.post('login/', async function(req, res) {
    let userInfo = await queryDbStatic("users", req.header['phone'], false, ['pw', 'id', 'first', 'last', 'type']);
    // userInfo stores the password hash, validates that the password is correct
    if (await verifyHash(req.header['pw'], userInfo['pw'])) {
        const jwt = generateAccessToken(userInfo['id'], req.header['phone']);
    
        // This is what's returned to be used for the frontend as well as for authentication
        const frontUser = {
            first: userInfo['first'],
            id: userInfo['id'],
            last: userInfo['last'],
            pn: req.header['phone'],
            type: userInfo['type'],
            jwt: jwt
        }
        res.status(200);
        res.send(frontUser);
    } else {
        res.status(401);
        res.statusMessage = "Invalid credentials";
        res.send({data: "Invalid credentials"});
    }
});

/* TODO: Add a history of accepted */
module.exports = router;
