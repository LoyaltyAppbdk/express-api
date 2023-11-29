const express = require('express');
const { generateUUID } = require("../controllers/uuidGenerator.js");
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
        
            
        } catch (error) {
            console.log(error)
            res.status(500);
            res.send("Uh oh! Something went wrong, please check back later.");
        }
    }
    // returns the list of general-view businesses
    console.log("endpoint: /restaurants/all, data: ", restaurants);
    res.send(restaurants);
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
        userPoints = userRestaurants["userRestaurants"][restaurantId];
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
    
    console.log("endpoint: /restaurants/restaurant/restaurantId, data: ", restaurantObject);
    res.status(200);
    res.send(restaurantObject);
});

// Sends transaction request into the restaurant's queue to get visit approved - Sent from the user side
// FOR APPROVAL/DECLINE, WE WILL PARSE THE REQUESTOR FIELD IN ORDER TO ADD A VISIT
router.post('/restaurant/:restaurantId/visit/', function(req, res) {
    const userId = req.header('userId');
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const requestorName = `${userId}/${req.header('firstName')} ${req.header('lastName')}`
    const restaurantId = req.params.restaurantId;
    // No need to query this as we 
    if(!req.header('restaurantName')) {
        res.status(500);
        res.send("Uh oh! Please make sure you are requesting from the restaurant's page");
    }
    const restaurantName = req.header('restaurantName');
    const transactionId = generateUUID();

    // Transaction object saved on the user side
    const userVisitTransaction = {
        [userId]: {
            [transactionId]: {
                time: null,
                isVisit: true,
                status: "REQUESTED",
                restaurantId: restaurantId,
                restaurantName: restaurantName,
            }
            
        }
    }

    const restaurantVisitQueue = {
        [restaurantId]: {
            [transactionId]: {
                time: null,
                isVisit: true,
                status: "REQUESTED",
                requestor: requestorName,
            }
        }
    }
    
    try {

        // Inserts userVisitTransaction to the user's history list 
        writeDb("userTransactions", userVisitTransaction);

        // Inserts visit request to the restaurant's visit queue
        writeDb("restaurantQueue", restaurantVisitQueue);
        
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.")
    }
    console.log("HERE")
    res.send("Request made!")
    res.status(200);
});

// Sends transaction request into the restaurant's queue to get prize redemption approved - Sent from the user side
/* Validates first in the database that they have reached the threshold */ 
router.post('/restaurant/:restaurantId/redeem/', function(req, res) {
    const userId = req.header('userId');
    const prize = req.header('prize');
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const requestorName = `${userId}/${req.header('firstName')} ${req.header('lastName')}`
    const restaurantId = req.params.restaurantId;
    // No need to query this as we 
    if(!req.header('restaurantName')) {
        res.status(500);
        res.send("Uh oh! Please make sure you are requesting from the restaurant's page");
    }
    const restaurantName = req.header('restaurantName');
    const transactionId = generateUUID();

    // Transaction object saved on the user side
    const userRedeemTransaction = {
        [userId]: {
            [transactionId]: {
                time: null,
                isVisit: false,
                status: "REQUESTED",
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                prize: prize
            }
        }
    }

    const restaurantRedeemQueue = {
        [restaurantId]: {
            [transactionId]: {
                time: null,
                isVisit: false,
                status: "REQUESTED",
                requestor: requestorName,
                prize: prize
            }
        }
    }
    
    try {

        // Inserts userVisitTransaction to the user's history list 
        writeDb("userTransactions", userRedeemTransaction);

        // Inserts visit request to the restaurant's visit queue
        writeDb("restaurantQueue", restaurantRedeemQueue);
        
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.")
    }
    res.status(200);
    res.send("Request made!")
});


module.exports = router;