const express = require('express');
const { generateUUID } = require("../controllers/uuidGenerator");
const { queryDbStatic, writeDb, updateDb, deleteDb } = require('../db');

var router = express.Router();

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */

router.post('/customer-request/accept', async function(req, res) {
    const userId = req.header('userId');
    // Name of the approved/decliner
    const approver = `${userId}/${req.header('firstName')} ${req.header('lastName')}`;
    const transactionId = req.header('transactionId');
    const restaurantId = req.header('restaurantId');

    const requestorId = req.header('requestorId');

    try {
        // Validates that the approver is an employee for the requested restaurant
        const validationId = await queryDbStatic("employees", userId, false, ["restaurantId"]);

        const isVisit = await queryDbStatic(`userTransactions/${requestorId}/${restaurantId}`, transactionId, false, ["isVisit"]);

        // Safe since we are only searching for transactions under the header provided restaurantId
        if(validationId["restaurantId"] !== restaurantId){
            throw new Error("Unauthorized operation attempted");
        } 

        // Updates the status of the restaurant transaction and assigns the approver
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/status`, "APPROVED");
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/approver`, approver);
        
        // Updates the status of the transaction for the user
        await updateDb(`userTransactions/${requestorId}`, restaurantId, `${transactionId}/status`, "APPROVED");

        // Removes from the restaurants queue
        await deleteDb("restaurantQueue", restaurantId, transactionId);

        // Removes points from user
        const customer = await queryDbStatic("users", requestorId, false, []);
        const restaurant = await queryDbStatic("restaurants", restaurantId, false, []);
        const pt = restaurant['pt'];
        const newPoints = customer["userRestaurants"][restaurantId]["points"] - pt;
        const visitOrRedeem = isVisit.isVisit ? "visitInProgress" : "redeemInProgress";
        
        // sets the new point balance for the user
        await updateDb("users", requestorId, `userRestaurants/${restaurantId}/points`, newPoints);
        
        // sets the redeem/visit in progress field to false again 
        await updateDb('users/', requestorId, `userRestaurants/${restaurantId}/${visitOrRedeem}`, false);

    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    res.status(200);
    res.send("Successfully approved customer request")
});

router.post('/customer-request/decline', async function(req, res) {
    const userId = req.header('userId');
    // Name of the approved/decliner
    const approver = `${userId}/${req.header('firstName')} ${req.header('lastName')}`;

    // Id of the requestor
    const requestorId = req.header('requestorId');

    const transactionId = req.header('transactionId');
    const restaurantId = req.header('restaurantId');

    try {
        // Validates that the approver is an employee for the requested restaurant
        const validationId = await queryDbStatic("employees", userId, false, ["restaurantId"]);
        // Safe since we are only searching for transactions under the header provided restaurantId
        if(validationId["restaurantId"] !== restaurantId){
            throw new Error("Unauthorized operation attempted");
        } 
        // Updates the status of the restaurant transaction and assigns the approver
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/status`, "DECLINED");
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/approver`, approver);
        
        // Updates the status of the transaction for the user
        await updateDb(`userTransactions/${requestorId}`, restaurantId, `${transactionId}/status`, "DECLINED");

        const isVisit = await queryDbStatic(`userTransactions/${requestorId}/${restaurantId}`, transactionId, false, ["isVisit"]);
        const visitOrRedeem = isVisit.isVisit ? "visitInProgress" : "redeemInProgress";
        
        // sets the redeem/visit in progress field to false again 
        await updateDb('users/', requestorId, `userRestaurants/${restaurantId}/${visitOrRedeem}`, false);

        // Removes from the restaurants queue
        await deleteDb("restaurantQueue", restaurantId, transactionId);
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    res.status(200);
    res.send("Successfully denied customer request");
});

router.get('/customer-request/all', async function(req, res) {
    const userId = req.header('userId');
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const restaurantId = req.header('restaurantId');
    let transactions, ret = [];
    try {
        transactions = await queryDbStatic("restaurantQueue", restaurantId, false, []);
    } catch (error) {
        res.status(500);
        console.log(error);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    
    for(let transaction in transactions) {
        transactions[transaction].id = transaction;
       ret.push(transactions[transaction]);
    }

    ret = requests.sort((a, b) => {
        const aTime = new Date(a.time).valueOf()
        const bTime = new Date(b.time).valueOf()
        return bTime - aTime;
    })

    console.log("endpoint: /customer-resquests/all, data: ", ret);
    res.status(200);
    res.send(ret);
});

router.get('/customer-request/history', async function(req, res) {
    const userId = req.header('userId');
    // Constructs the requestor name (frontend should be able to pick up first, last, and userId after sign-in AKA should be cached)
    const restaurantId = req.header('restaurantId');
    let transactions, ret = [];
    try {
        transactions = await queryDbStatic("restaurantHistory", restaurantId, false, []);
    } catch (error) {
        res.status(500);
        console.log(error);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    
    for(let transaction in transactions) {
        transactions[transaction].id = transaction;
       ret.push(transactions[transaction]);
    }

    ret = requests.sort((a, b) => {
        const aTime = new Date(a.time).valueOf()
        const bTime = new Date(b.time).valueOf()
        return bTime - aTime;
    })

    ret.slice(0,25)

    console.log("endpoint: /customer-resquests/history, data: ", ret);
    res.status(200);
    res.send(ret);
})
module.exports = router;