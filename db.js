import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
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
  const db = getDatabase();
  set(ref(db, 'Restaurant/' + restaurantId), {
    "restName": restName,
    "image" : image,
    "PT" : PT,
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

// writeRestaurantData(restaurantId, restName, image, PT, users, prizes, history, queue, employees);

/**
 * 
 * @param {*} userId    Unique user ID
 * @param {*} firstName First name of user
 * @param {*} lastName  Last name of user
 * @param {*} userRest  Array of restaurants user uses
 * @param {*} phone     User's phone number
 * @param {*} email     User's email 
 * @param {*} imageUrl  Image url for user's profile picture
 */
function writeUserData(userId, firstName, lastName, userRest, phone, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'Restaurant/' + userId), {
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

// const db = getDatabase();
// const starCountRef = ref(db, 'posts/' + postId + '/starCount');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   updateStarCount(postElement, data);
// });

