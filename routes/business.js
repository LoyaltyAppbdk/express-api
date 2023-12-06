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
        // Updates the status of the restaurant transaction and assigns the approver
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/status`, "APPROVED");
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/approver`, approver);
        
        // Updates the status of the transaction for the user
        await updateDb("userTransactions", requestorId, `${transactionId}/status`, "APPROVED");

        // Removes from the restaurants queue
        await deleteDb("restaurantQueue", restaurantId, transactionId);
        
        // Removes points from user
        const customer = await queryDbStatic("users", requestorId, false, []);
        const restaurant = await queryDbStatic("restaurants", restaurantId, false, []);
        const pt = restaurant['pt'];
        const newPoints = customer["userRestaurants"][restaurantId] - pt;
        await updateDb("users", requestorId, `userRestaurants/${restaurantId}`, newPoints);

    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
        return;
    }
    res.status(200);
    res.send("Successfully approved customer request")
});

router.post('/customer-request/decline', async function(req, res) {
    // Name of the approved/decliner
    const userId = req.header('userId');
    const approver = `${userId}/${req.header('firstName')} ${req.header('lastName')}`;

    // Id of the requestor
    const requestorId = req.header('requestorId');

    const transactionId = req.header('transactionId');
    const restaurantId = req.header('restaurantId');

    try {
        // Updates the status of the restaurant transaction and assigns the approver
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/status`, "DECLINED");
        await updateDb("restaurantHistory", restaurantId, `${transactionId}/approver`, approver);
        
        // Updates the status of the transaction for the user
        await updateDb("userTransactions", requestorId, `${transactionId}/status`, "DECLINED");

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

module.exports = router;