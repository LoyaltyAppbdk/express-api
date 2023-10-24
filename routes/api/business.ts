import express from "express";
import { initializeApp } from 'firebase/app';
import { get } from "http";

var router = express.Router();

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */
/* payload will be the current working employee and the transaction */

router.post('my-business/visit/:visitId/accept', function(req, res) {
    if(req['isVisit']){ //add points
        let transaction = {
            Time: req['time'],
            ApproverId: req['id'],
            ApproverName: req['First'] + ' ' + req['Last'],
            RequestorId: req['RequestorId'],
            RequestorName: req['RequestorName'],
            Item: req['Item'],
            isVisit: req['isVisit'],
            isApproved: req['isApproved']
        }
        //make a put request to transaction
        //get user and make a put request to add the user's visit amount
        
    } else { //redeem item
        let transaction = {
            Time: req['time'],
            ApproverId: req['id'],
            ApproverName: req['First'] + ' ' + req['Last'],
            RequestorId: req['RequestorId'],
            RequestorName: req['RequestorName'],
            Item: req['Item'],
            isVisit: req['isVisit'],
            isApproved: req['isApproved']
        }
        //make a put request to transaction
        //get user and make a put request to add the user's visit amount
    }   
})

router.post('my-business/visit/:visitId/decline', function(req, res) {
    if(req['isVisit']){
        let transaction = {
            Time: req['time'],
            ApproverId: req['id'],
            ApproverName: req['First'] + ' ' + req['Last'],
            RequestorId: req['RequestorId'],
            RequestorName: req['RequestorName'],
            Item: req['Item'],
            isVisit: req['isVisit'],
            isApproved: req['isApproved']
        }
        //make a put request to transaction
        
    } else {
        let transaction = {
            Time: req['time'],
            ApproverId: req['id'],
            ApproverName: req['First'] + ' ' + req['Last'],
            RequestorId: req['RequestorId'],
            RequestorName: req['RequestorName'],
            Item: req['Item'],
            isVisit: req['isVisit'],
            isApproved: req['isApproved']
        }
        //make a put request to transaction
    }
})

// /* POST accept/decline prize */
// /* Sends: a boolean */
// /* If accept, confirms the points removal */
// /* If decline, refunds points */
// /* Removes from queue */

// /* Also moves into transaction history */
// router.post('my-business/redeem/:redeemId/accept', function(req, res) {
//     if(!req['isVisit']){
        
//     }
// })

// /* Also moves into transaction history */
// router.post('my-business/redeem/:redeemId/decline', function(req, res) {
//     if(!req['isVisit']){
        
//     }
// })