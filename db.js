const { initializeApp } =  require("firebase/app");
const { getDatabase, ref, set, update, get } =  require("firebase/database");
const { url } =  require("inspector");
const { endianness } =  require("os");
// import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://rewards-c59a2-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Set a reference for the database
const databaseRef = ref(database);

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

// https://github.com/firebase/snippets-web/tree/d781c67b528afe99fcdb7c7056104772463fa3ec/snippets/database-next/read-and-write



function writeDb(table, object){
  Object.keys(object).forEach((key) => {
    set(ref(database, `${table}/` + key), object[key])
    .then(() =>{
      console.log("User data successfully written for " + key);
    })
    .catch((error) =>{
      console.log("User data failed to write for " + userId +" | "+ error);
      throw error;
    });
  })
}

// Given an object type, id, boolean, and field, query and return that object. If the field is empty, return the whole object. If the boolean is false, exclude the fields when returning the object
function queryDbStatic(objectType, path, exclude, fields) {
  get(ref(database, `${objectType}/${path}`)).then((snapshot) => {
    if (snapshot.exists()) {
      // The object retrieved from the database query
      let fullObject = snapshot.val();
      // filteredObject is the return object
      let filteredObject = {};

      // If exclude = false, then we keep all other attributes not contained in fields list
      // If execute = true, then we keep only the attributes contained in fields list
      if(exclude) {
        // for loop does not execute if empty or null
        // filters out the necessary fields
        filteredObject = fullObject;

        for(field of fields) {
          delete filteredObject[field]; // filter out (remove) the desired field
        }

      } else {
        // This grabs the necessary fields

        for(let field of fields) {
          filteredObject[field] = snapshot.val()[field];
        }
      }

      // If filteredObject not empty (AKA fields are provided) then we set fullObject to filteredObject 
      fullObject = (JSON.stringify(filteredObject) === '{}' ? fullObject : filteredObject );

      console.log(fullObject)
      return fullObject;

    } else {
      console.log("No data available");
      return new Error("No data available");
    }
  }).catch((error) => {
    console.error(error);
    return error;
  });
}

function updateArrayElement(objectType, id, key, value, isArray) {
  if(isArray){

  } else {
      const newPostKey = push(child(ref(database), 'posts')).key;
  }

}

function appendArrayElement() {

}

function removeArrayElement() {

}

function getArrayElement() {

}

// From queue to history - maybe we don't abstract this
function moveArrayElement() {
  getArrayElement();
  appendArrayElement();
  removeArrayElement();
}

function initializeDb() {
  // objects
    const userA = {
      first: "Eren",
      last: "Yeager",
      id: "3323-1sf2-oupq-01pa",
      phone: "000-000-000",
      pw: "123123123",
      userRestaurants: ["a"]
    }

    const userB = {
      first: "Joe",
      last: "Goldberg",
      id: "3323-1sf2-oupq-01pb",
      phone: "000-000-000",
      pw: "123123123",
      userRestaurants: ["a", "b"]
    }

    const prizeA = {
      image: "stringByte",
      name: "pork intestine gui",
      id: "pa"
    }

    const prizeB = {
      image: "stringByte",
      name: "tik tok pookie",
      id: "pb"
    }

    const restaurantA = {
      id: "ra",
      users: ["3323-1sf2-oupq-01pa"],
      name: "gopchang",
      pt: 100,
      image: "stringByte",
      address: "something something address here",
      prizes: [prizeA, prizeB],
      employees: ["ea"]
    }

    const restaurantB = {
      id: "rb",
      users: ["3323-1sf2-oupq-01pa", "3323-1sf2-oupq-01pb"],
      name: "Yolo Chicken",
      pt: 100,
      image: "stringByte",
      address: "somewhere somewhere CP",
      prizes: [prizeB],
      employees: ["eb"]
    }

    const employeeA = {
      owner: true,
      first: "randomFirst",
      last: "randomLast",
      restuarantId: "ra",
      id: "ea",
      pw: "pw"
    }

    const employeeB = {
      owner: true,
      first: "Austin",
      last: "Han",
      restaurantId: "rb",
      id: "eb",
      pw: "pw"
    }
  
    const transactionA = {
      time: null,
      approver: "ea/randomFirst randomLast",
      requestor: "3323-1sf2-oupq-01pa/Eren Yeager",
      isVisit: true,
      id: "ta",
      status: "approved"
    }

    const transactionB = {
      time: null,
      approver: "eb/Austin Han",
      requestor: "3323-1sf2-oupq-01pb/Joe Goldberg",
      isVisit: false,
      id: "tb",
      status: "denied"
    }

    const transactionC = {
      time: null,
      approver: null,
      requestor: "3323-1sf2-oupq-01pb/Joe Goldberg",
      isVisit: false,
      item: "pb",
      id: "tc",
      status: "denied"
    }

    // tables
    const restaurants = {
      "ra": restaurantA,
      "rb": restaurantB
    }

    const users = {
      "3323-1sf2-oupq-01pa": userA,
      "3323-1sf2-oupq-01pb": userB
    }

    const employees = {
      "ea": employeeA,
      "eb": employeeB
    }

    const userTransactions = {
      "3323-1sf2-oupq-01pa": {
        "tb": transactionB,
      },
      "3323-1sf2-oupq-01pa": {
        "ta": transactionA,
        "tc": transactionC
      }
    } 

    const restaurantQueue = {
      "ra": {
        "tc": transactionC
      },
      "rb": {}
    }

    const restaurantHistory = {
      "ra": {
        "ta": transactionA
        // transactionC excluded on purpose
      },
      "rb": {
        "tb": transactionB
      }
    }
    
    writeDb("restaurants", restaurants);
    writeDb("users", users);
    writeDb("employees", employees);
    writeDb("userTransactions", userTransactions);
    writeDb("restaurantQueue", restaurantQueue);
    writeDb("restaurantHistory", restaurantHistory);

}

initializeDb();
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









// // The object retrieved from the database query
// let fullObject = snapshot.val();
// // filteredObject is the return object
// let filteredObject = {};

// // If exclude = false, then we keep all other attributes not contained in fields list
// // If execute = true, then we keep only the attributes contained in fields list
// if(exclude) {
//   // for loop does not execute if empty or null
//   // filters out the necessary fields
//   filteredObject = fullObject;

//   for(field of fields) {
//     delete filteredObject[field]; // filter out (remove) the desired field
//   }

// } else {
//   // This grabs the necessary fields

//   for(field of fields) {
//     filteredObject[field] = snapshot.val()[field];
//   }
// }

// // If filteredObject not empty (AKA fields are provided) then we set fullObject to filteredObject 
// fullObject = (JSON.stringify(filteredObject) === '{}' ? fullObject :filteredObject );

// console.log(fullObject)
// return fullObject;