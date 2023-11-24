const express = require('express');
import { cors } from '../constants/baseHeader';
const generateUUID = require("../controllers/uuidGenerator");

var router = express.Router();

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */

router.post('my-business/visit/:visitId/accept', function(req, res) {
    const visitId = req.params.visitId;
    // Name of the approved/decliner
    const approver = `${userId}/${req['firstName']} ${req['lastName']}`;
    const restaurantId = req['restaurantId'];
    try {
        // Retrieves from the restaurant 
        let restaurantTransaction = null  
        // Retrieves from the user list and set status to APPROVED
        let customerTransaction = null
        // Should overwrite the approver here and set status to APPROVED
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }
});

router.post('my-business/visit/:visitId/decline', function(req, res) {
    const visitId = req.params.visitId;
    // Name of the approved/decliner
    const approver = `${userId}/${req['firstName']} ${req['lastName']}`;
    const restaurantId = req['restaurantId'];
    try {
        // Retrieves from the restaurant 
        let restaurantTransaction = null  
        // Retrieves from the user list and set status to DECLINED
        let customerTransaction = null
        // Should overwrite the approver here and set status to DECLINED
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }

});

/* POST accept/decline prize */
/* Sends: a boolean */
/* If accept, confirms the points removal */
/* If decline, refunds points */
/* Removes from queue */

/* Also moves into transaction history */
router.post('my-business/redeem/:redeemId/accept', function(req, res) {
    // RedeemId is the transactionId
    const transactionId = req.params.redeemId;
    const restaurantId = req['restaurantId'];
    // Name of the approved/decliner
    const approver = `${userId}/${req['firstName']} ${req['lastName']}`;
    try {
        // Retrieves from the restaurant 
        let restaurantTransaction = null  
        // Retrieves from the user list and set status to APPROVED
        let customerTransaction = null
        // Should overwrite the approver here and set status to APPROVED
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }
});

/* Also moves into transaction history */
router.post('my-business/redeem/:redeemId/decline', function(req, res) {
    // RedeemId is the transactionId
    const transactionId = req.params.redeemId;
    const restaurantId = req['restaurantId'];
    // Name of the approved/decliner
    const approver = `${userId}/${req['firstName']} ${req['lastName']}`;
    try {
        // Retrieves from the restaurant 
        let restaurantTransaction = null  
        // Retrieves from the user list and set status to DECLINED
        let customerTransaction = null
        // Should overwrite the approver here and set status to DECLINED
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }
});

router.query('my-business/requests', function(req, res) {
    // Retrieves the businessId from the request in order to query for the requests 
    const restaurantId = req['restaurantId'];
    try {
        // Make a DB call to get the queue list
        const queue = null;
    } catch (error) {
        res.status(500);
        res.send("Uh oh! Something went wrong, please check back later.");
    }
    
    res.status(200);
    res.send(queue);
});

module.exports = router;