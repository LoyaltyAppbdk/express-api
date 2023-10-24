import express from "express";
import { initializeApp } from 'firebase/app';
import { DateTime } from 'luxon';

var router = express.Router();

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

//the user is sending below post requests to the restaurant

/* POST request to add a visit*/
/* Sends: user's name as well as their visit amount */
/* Removes amount from their visits */
/* IF declined or timed out, then we refill the amount */
/* payload will be restaurant id and user id */
router.post('restaurants/restaurant/:restaurantId/visit/:visitId', function(req, res) {
    let transaction = {
        Time: DateTime.now().toLocaleString(DateTime.DATE_FULL),
        RequestorId: req['userId'],
        RequestorName: req['First'] + ' ' + req['Last'],
        isVisit: true
    }
    //make a put request to the restaurant's queue
})

/* POST request to claim a prize */
/* Sends: user's name, ID as well as their item (string) */
/* Validates first in the database that they have reached the threshold */
/* Temp removes points */
/* payload will be restaurant id and user id and item id*/
router.post('restaurants/restaurant/:restaurantId/redeem/:redeemId', function(req, res) {
    let transaction = {
        Time: DateTime.now().toLocaleString(DateTime.DATE_FULL),
        RequestorId: req['userId'],
        RequestorName: req['First'] + ' ' + req['Last'],
        item: req['itemId'],
        isVisit: true
    }
    //make a put request to the restaurant's queue
})