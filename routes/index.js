var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET users restaurants*/
/* Returns: restaurant list*/
/* For each restaurant contains: string name, users points, restaurants pt threshold, image of restaurant */

/* GET restaurant details */
/* Make another GET call from above (just to refresh) */
/* Additionally, get data for street address, prize objects (string name, image)*/

/* GET restaurants queue */
/* Returns: list of users */
/* In list of users, we have the visits and threshold OR the item, as well as their name*/

/* POST request */
/* Sends: user's name as well as their visit amount */
/* Removes amount from their visits */
/* IF declined or timed out, then we refill the amount */

/* POST accept/decline visit */
/* Sends: a boolean */
/* Also saves the request/adds 1 to the user's visit amount */
/* Removes from queue */

/* POST prize selection */
/* Sends: user's name as well as their item (string) */
/* Validates first in the database that they have reached the threshold */
/* Temp removes points */

/* POST accept/decline prize */
/* Sends: a boolean */
/* If accept, confirms the points removal */
/* If decline, refunds points */
/* Removes from queue */

/* FUNC redeem remove */
/* Subtracts threshold amt from user's total visits amt */  

/* FUNC save to history*/
/* Every request made/reciprocated should be saved in a history section */

/* TODO: Add a history of accepted */
module.exports = router;
