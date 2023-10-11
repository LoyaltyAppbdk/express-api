import express from "express";
var router = express.Router();

/* GET users restaurants*/
/* Returns: restaurant list*/
/* For each restaurant contains: string name, users points, restaurants pt threshold, image of restaurant */
router.get('restaurants/all/', function(req, res) {
})

/* GET restaurant details */
/* Make another GET call from above (just to refresh) */
/* Additionally, get data for street address, prize objects (string name, image)*/
router.get('restaurants/restaurant/id:', function(req, res) {
})

/* POST request */
/* Sends: user's name as well as their visit amount */
/* Removes amount from their visits */
/* IF declined or timed out, then we refill the amount */
router.post('restaurants/restaurant/id:/visit/id:', function(req, res) {
})

/* POST prize selection */
/* Sends: user's name as well as their item (string) */
/* Validates first in the database that they have reached the threshold */
/* Temp removes points */
router.post('restaurants/restaurant/id:/redeem/id:', function(req, res) {
})