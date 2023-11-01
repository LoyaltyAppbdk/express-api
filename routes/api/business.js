const express = require('express');
import { cors } from '../../constants/baseHeader';

var router = express.Router();

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */

router.post('my-business/visit/:visitId/accept', function(req, res) {

})

router.post('my-business/visit/:visitId/decline', function(req, res) {

})

/* POST accept/decline prize */
/* Sends: a boolean */
/* If accept, confirms the points removal */
/* If decline, refunds points */
/* Removes from queue */

/* Also moves into transaction history */
router.post('my-business/redeem/:redeemId/accept', function(req, res) {

})

/* Also moves into transaction history */
router.post('my-business/redeem/:redeemId/decline', function(req, res) {

})