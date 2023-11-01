const express = require('express');
import { cors } from '../../constants/baseHeader';

var router = express.Router();

router.get('/', (req, res)=>{ 
    res.status(200); 
    res.send("Welcome to root URL of Server"); 
}); 

/* GET users restaurants*/
/* Returns: restaurant list*/
/* For each restaurant contains: string name, users points, restaurants pt threshold, image of restaurant */
router.get('restaurants/all/', function(req, res) {
    const userId = req['userId'];

    // Go to User table -> query for Id -> get all restaurants there
    const restaurants = [];
    return restaurants;
})

/* GET restaurant details */
/* Make another GET call from above (just to refresh) */
/* Additionally, get data for street address, prize objects (string name, image)*/
router.get('restaurants/restaurant/:restaurantId', function(req, res) {
    let userId = req['userId'];
    let restuarantId = req.params.restaurantId;

    // Query for user -> get restaurant array -> query restaurantId -> get points
    // Query restaurant -> get userId -> query user -> get user points
    //                  -> get restaurant details
    // return lesser of two pts

    // !!! todo -> create a equalize function to make the pts the lower of the two
})

/* POST request */
/* Sends: user's name as well as their visit amount */
/* Removes amount from their visits */
/* IF declined or timed out, then we refill the amount */
router.post('restaurants/restaurant/:restaurantId/visit/:visitId', function(req, res) {
})

/* POST prize selection */
/* Sends: user's name, ID as well as their item (string) */
/* Validates first in the database that they have reached the threshold */
/* Temp removes points */
router.post('restaurants/restaurant/:restaurantId/redeem/:redeemId', function(req, res) {
})

module.exports = router;