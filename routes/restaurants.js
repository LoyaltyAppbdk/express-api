const express = require('express');
const generateUUID = require("../controllers/uuidGenerator.js");
const { writeDb, queryDbStatic } = require('../db.js')

var router = express.Router();

router.get('/', (req, res)=>{ 
    res.status(200); 
    res.send("Welcome to root URL of Server"); 
}); 

/* 
MY-POINTS PAGE
Retrieves UserRestaurants from User (via userId)
*/
router.get('/all/', async (req, res) => {
    
    const userId = req.header('userId');
    let query;

    try {
        // Query for the user's restaurant list using userId variable
        query = await queryDbStatic("users", userId, false, ["userRestaurants"]);
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }

    // List of restaurantObject (return object)
    let restaurants = [];

    // List of customer visited restaurants with the points - retrieved from user query
    let userRestaurants = query['userRestaurants'];
    
    // userRestaurant includes restaurantId and Points
    for (let userRestaurant in userRestaurants) {
        try {
            console.log("userRestaurant", userRestaurant)
            // restaurant is the queried single restaurant object using userRestaurant.id
            const restaurant = await queryDbStatic("restaurants", userRestaurant, true, []);

            // creates JSON for parsing on client-side
            let restaurantObject = {
                name: restaurant.name,
                image: restaurant.image,
                // Retrieves from userRestaurants query object, using the key from the current loop to get the point
                currentVisit: userRestaurants[userRestaurant],
                pt: restaurant.pt,
            }

            // adds to list of general-view businesses
            restaurants.push(restaurantObject);
        
            // returns the list of general-view businesses
            res.send(restaurants);
        } catch (error) {
            console.log(error)
            res.status(500);
            res.send("Uh oh! Something went wrong, please check back later.");
        }
    }
});

/* 
RESTAURANT/RESTAURANT-ID PAGE 
Returns details information for a specific restaurant, including how many visits the user has, etc.
*/
router.get('/restaurant/:restaurantId', async (req, res) => {

    const userId = req.header('userId');
    const restaurantId = req.params.restaurantId;
    let userPoints, restaurant;

    try {
        // Queried restaurant object using restaurant Id (exclude Users array in the query)
        restaurant = await queryDbStatic("restaurants", restaurantId, true, []);

        // Queried userRestaurant object that lives in the user's field
        const userRestaurants = await queryDbStatic("users", userId, false, ["userRestaurants"]);
        // User points filtered by the restaurantId
        userPoints = userRestaurants[restaurantId]
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }
    

    const restaurantObject = {
        name: restaurant.name,
        image: restaurant.image,
        pt: restaurant.pt,
        points: userPoints,
        address: restaurant.address,
        prizes: restaurant.prizes,
    };
    console.log(restaurantObject)
    res.status(200);
    res.send(restaurantObject);
});

// Sends transaction request into the restaurant's queue to get visit approved - Sent from the user side
// FOR APPROVAL/DECLINE, WE WILL PARSE THE REQUESTOR FIELD IN ORDER TO ADD A VISIT
router.post('/restaurant/:restaurantId/visit/', function(req, res) {
    const userId = req['userId'];
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const requestorName = `${userId}/${req['firstName']} ${req['lastName']}`
    const restaurantId = req.params.restaurantId;
    const restaurantName = req['restaurantName'];
    const transactionId = generateUUID();
    // Transaction sent to the restaurant
    const visitTransaction = {
        time: null,
        requestor: requestorName,
        isVisit: true,
        transactionId: transactionId
    }

    // Transaction object saved on the user side
    const userVisitTransaction = {
        time: null,
        isVisit: true,
        status: "REQUESTED",
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        transactionId: transactionId
    }
    
    try {

        // Need to make a db call where we can locate the restaurant and insert the visitTransaction item into the queue list

        // Inserts userVisitTransaction to the user's history list
        
    } catch (error) {

        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.")
    }
    res.send("Request made!")
    res.status(200);
});

// Sends transaction request into the restaurant's queue to get prize redemption approved - Sent from the user side
/* Validates first in the database that they have reached the threshold */ 
router.post('/restaurant/:restaurantId/redeem/', function(req, res) {
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const requestorName = `${req['userId']}/${req['firstName']} ${req['lastName']}` 
    const restaurantId = req.params.restaurantId;
    const restaurantName = req['restaurantName'];
    const transactionId = generateUUID();

    // Transaction sent to the restaurant
    const redeemTransaction = {
        time: null,
        requestor: requestorName,
        isVisit: false,
        transactionId: transactionId
    }

    // Transaction saved on the user side
    const userRedeemTransaction = {
        time: null,
        isVisit: false,
        status: "REQUESTED",
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        transactionId: transactionId 
    }
    
    try {
        // Need to make a db call where we can locate the restaurant and insert the redeemTransaction item into the queue list
        
        // Inserts userRedeemTransaction to the user's history list
        // Need to find a way to limit to 25
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }

    res.send("Request sent!")
    res.status(200);
});

module.exports = router;