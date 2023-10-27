import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update } from "firebase/database";
import { url } from "inspector";
import { endianness } from "os";
// import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://rewardsapp-43234-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);


/**
 * 
 * @param {*} restaurantId  Unique restaurant ID (String)
 * @param {*} restName      Name for Restaurant (String)
 * @param {*} image         Image url for resturant (String)
 * @param {*} PT            Point Threshold (Int)
 * @param {*} users         Array of User objects ([User1, User2,...])
 * @param {*} prizes        Array of Prize objects ([Prize1, Prize2])
 * @param {*} history       Array of transaction history ([transaction])
 * @param {*} queue         Array of transactions to be completed ([transaction])
 */
function writeRestaurantData(restaurantId, restName, image, PT, users, prizes, history, queue, employees) {
  set(ref(database, 'restaurant/' + restaurantId), {
    "restName": restName,
    "image" : image,
    "pt" : PT,
    "users": users,
    "prizes" : prizes,
    "history" : history,
    "queue" : queue,
    "employees": employees
  })
  .then(() =>{
    console.log("Restaurant data successfully written for " + restaurantId);
  })
  .catch((error) =>{
    console.log("Restaurant data failed to write for " + restaurantId +" | "+ error);
    throw error;
  });;
}


/**
 * 
 * @param {*} userId    Unique user ID (String)
 * @param {*} firstName First name of user (String)
 * @param {*} lastName  Last name of user (String)
 * @param {*} userRest  Array of restaurants user users [restaurant1, restaurant2, ...]
 * @param {*} phone     User's phone number (Int)
 * @param {*} email     User's email (String)
 * @param {*} imageUrl  Image url for user's profile picture ()
 */
function writeUserData(userId, firstName, lastName, userRest, phone, email, imageUrl) {
  set(ref(database, 'users/' + userId), {
    "firstName": firstName,
    "lastName": lastName,
    "userRest" : userRest,
    "phone" : phone,
    "email" : email,
    "imageUrl" : imageUrl
  })
  .then(() =>{
    console.log("User data successfully written for " + userId);
  })
  .catch((error) =>{
    console.log("User data failed to write for " + userId +" | "+ error);
    throw error;
  });
}

/**
 * 
 * @param {*} table       Selection of table for update
 * @param {*} id          ID of restaurant or user to update field
 * @param {*} target      Target field to update data
 * @param {*} updatedData New Data to input
 */
function updateData(table, id, target, updatedData){
  update(ref(database, table+ "/" + id), {
    [target] : updatedData
  })
  .then(() =>{
    console.log("Data successfully updated for " + id);
  })
  .catch((error) =>{
    console.log("Data failed to updated for " + id +" | "+ error);
    throw error;
  });
}



/**
 * Test Sample Data
 */

// const userId = 123;
// const firstName = "ur";
// const userRest = [];
// const lastName = "mom";
// const phone = 123112311;
// const email = "anusisgreat@butfuckonly.com";
// const imageUrl = "japaneseSchoolGirl696969696969"

// const prize = {"image": "test", "name": "pizza", "id": "fuckmerightdaddy"};
// const employee = {"owner": true, "firstName": "first", "lastName": "last", "restaurantId": 45, "id": 132}
// const restaurantId = "1";
// const restName = "testRest";
// const PT = 5;
// const image = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbuffer.com%2Flibrary%2Ffree-images%2F&psig=AOvVaw1gXkAl7uMrsQ0d2dgN7Tb9&ust=1698193519377000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPie2P61jYIDFQAAAAAdAAAAABAE";
// const address = "ur mom";
// const prizes = [prize, prize];
// const history = ["uranus"];
// const queue = ["queue"];
// const users = ["users", "users"];
// const employees = [employee, employee]


/**
 * Test Sample Calls
 */

// writeRestaurantData(restaurantId, restName, image, PT, users, prizes, history, queue, employees);

// writeUserData(userId, firstName, userRest, lastName, phone, email, imageUrl);

// updateData("users", 123, "userRest", "mommy");

