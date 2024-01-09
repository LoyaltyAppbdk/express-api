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
    console.log(req.header['userId'])
    console.log(userId)
    let query;

    try {
        // Query for the user's restaurant list using userId variable
        query = await queryDbStatic("users", userId, false, ["userRestaurants"]);
        console.log(query)
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
                id: restaurant.id,
                currentVisit: userRestaurants[userRestaurant],
                pt: restaurant.pt,
            }
            
            // adds to list of general-view businesses
            restaurants.push(restaurantObject);
            
        } catch (error) {
            console.log(error)
            res.status(500);
            res.send("Uh oh! Something went wrong, please check back later.");
            return;
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
        return;
    }
    
    const restaurantObject = {
        name: restaurant.name,
        image: restaurant.image,
        pt: restaurant.pt,
        currentVisit: userPoints,
        address: restaurant.address,
        prizes: restaurant.prizes,
    };
    
    console.log("endpoint: /restaurants/restaurant/restaurantId, data: ", restaurantObject);
    res.status(200);
    res.send(restaurantObject);
});

router.get('/restaurant/:restaurantId/history', async (req, res) => {
    console.log("HERE")
    const userId = req.header('userId');
    const restaurantId = req.params.restaurantId;
    let transactions, ret = [];

    try {
        transactions = await queryDbStatic(`userTransactions/${userId}`, restaurantId, false, []);
        console.log(transactions)
    } catch (error) {
        res.status(500);
        res.send(error);
        return;
    }
    for(let transaction in transactions) {
        transactions[transaction].id = transaction;
        ret.push(transactions[transaction]);
    }

    ret = ret.sort((a, b) => {
        const aTime = new Date(a.time).valueOf()
        const bTime = new Date(b.time).valueOf()
        return bTime - aTime;
    })

    ret.slice(0,25)

    console.log("endpoint: /customer-resquests/history, data: ", ret);
    res.status(200);
    res.send(ret);
    return;
})

// Sends transaction request into the restaurant's queue to get visit approved - Sent from the user side
// FOR APPROVAL/DECLINE, WE WILL PARSE THE REQUESTOR FIELD IN ORDER TO ADD A VISIT
router.post('/restaurant/:restaurantId/visit/', async (req, res) => {
    const dateTime = new Date().toLocaleString();
    // !!! Need to validate that the user has enough point
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
        [transactionId]: {
            time: dateTime,
            isVisit: true,
            status: "REQUESTED",
            restaurantId: restaurantId,
            restaurantName: restaurantName,
        }            
    }

    const restaurantVisitQueue = {
        [transactionId]: {
            time: dateTime,
            isVisit: true,
            status: "REQUESTED",
            requestor: requestorName,
        }
    }
    
    try {

        const userRestaurants = await queryDbStatic("users", userId, false, ["userRestaurants"]);        
        // Makes sure that a visit isn't already in progress. If it is, then we don't proceed to submit another request
        if(userRestaurants["userRestaurants"][restaurantId]["visitInProgress"]) {
            res.status(200);
            res.send("A visit is already in progress");
            return;
        }

        // Inserts userVisitTransaction to the user's history list 
        await writeDb(`userTransactions/${userId}/${restaurantId}`, userVisitTransaction);

        // Inserts visit request to the restaurant's visit queue
        await writeDb(`restaurantQueue/${restaurantId}`, restaurantVisitQueue);
        
        // Inserts visit request to the restaurant's visit history
        await writeDb(`restaurantHistory/${restaurantId}`, restaurantVisitQueue);

        // Sets visit in progress identifier to true
        await writeDb(`users/${userId}/userRestaurants/${restaurantId}`, {visitInProgress: true});

    } catch (error) {
        console.log(error)
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    res.send("Request made!")
    res.status(200);
});

// Sends transaction request into the restaurant's queue to get prize redemption approved - Sent from the user side
/* Validates first in the database that they have reached the threshold */ 
router.post('/restaurant/:restaurantId/redeem/', async (req, res) => {
    const dateTime = new Date().toLocaleString();
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
        [transactionId]: {
            time: dateTime,
            isVisit: false,
            status: "REQUESTED",
            restaurantId: restaurantId,
            restaurantName: restaurantName,
            prize: prize
        }
    }

    const restaurantRedeemQueue = {
        [transactionId]: {
            time: dateTime,
            isVisit: false,
            status: "REQUESTED",
            requestor: requestorName,
            prize: prize
        }
    }

    
    try {
        // This block validates that the user has enough points before sending the request

        // Gets the point threshold for the restaurant
        const restaurantPT = await queryDbStatic("restaurants", restaurantId, false, ["pt"]);
        // Gets the user's current points for the restaurant 
        const userRestaurants = await queryDbStatic("users", userId, false, ["userRestaurants"]);
        const userPoints = userRestaurants["userRestaurants"][restaurantId]["points"];
        
        // Makes sure that a redeem isn't already in progress. If it is, then we don't proceed to submit another request
        if(userRestaurants["userRestaurants"][restaurantId]["redeemInProgress"]) {
            res.status(200);
            res.send("A redeem is already in progress");
            return;
        }
        
        // Throws 500 if insufficient as the user shouldn't be able to access this endpoint
        if(restaurantPT['pt'] > userPoints){
            res.status(500);
            res.send("Insufficient points");
            return;
        }
        // Inserts userRedeemTransaction to the user's history list 
        await writeDb(`userTransactions/${userId}/${restaurantId}`, userRedeemTransaction);

        // Inserts visit request to the restaurant's redeem queue
        await writeDb(`restaurantQueue/${restaurantId}`, restaurantRedeemQueue);

        // Inserts visit request to the restaurant's redeem history
        await writeDb(`restaurantHistory/${restaurantId}`, restaurantRedeemQueue);

        // Sets redeem in progress identifier to true
        await writeDb(`users/${userId}/userRestaurants/${restaurantId}`, {redeemInProgress: true});
        
        res.status(200);
        res.send("Request made!");
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    return;
});

module.exports = router;