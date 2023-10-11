import express from "express";
var router = express.Router();

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */

router.post('my-business/visit/id:/accept', function(req, res) {
})

router.post('my-business/visit/id:/decline', function(req, res) {
})

/* POST accept/decline prize */
/* Sends: a boolean */
/* If accept, confirms the points removal */
/* If decline, refunds points */
/* Removes from queue */

router.post('my-business/redeem/id:/accept', function(req, res) {
})

router.post('my-business/redeem/id:/decline', function(req, res) {
})