const {writeDb} = require('./db')

function initializeDb () {
    // objects
      const userA = {
        first: "Eren",
        last: "Yeager",
        id: "3323-1sf2-oupq-01pa",
        phone: "000-000-000",
        pw: "123123123",
        userRestaurants: {ra: {points: 100}}
      }

      const userB = {
        first: "Joe",
        last: "Goldberg",
        id: "3323-1sf2-oupq-01pb",
        phone: "000-000-000",
        pw: "123123123",
        userRestaurants: {ra: {points: 20}, rb: {points: 54}}
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
        prizes: {
          pa: prizeA,
          pb: prizeB
        },
        employees: ["ea"]
      }

      const restaurantB = {
        id: "rb",
        users: ["3323-1sf2-oupq-01pa", "3323-1sf2-oupq-01pb"],
        name: "Yolo Chicken",
        pt: 100,
        image: "stringByte",
        address: "somewhere somewhere CP",
        prizes: {
          pb: prizeB
        },
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

      const userTransactionA = {
        time: null,
        isVisit: true,
        restaurant: "ra/Yolo Chicken",
        status: "approved"
      }

      const userTransactionB = {
        time: null,
        isVisit: false,
        prize: "pb/tik tok pookie",
        restaurant: "rb/Gopchang",
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
          "tb": userTransactionB,
        },
        "3323-1sf2-oupq-01pa": {
          "ta": userTransactionA,
        }
      } 

      const restaurantQueue = {
        "ra": {
          "ta": transactionA,
          "holder": "holder"
        },
        "rb": {}
      }

      const restaurantHistory = {
        "ra": {
          "ta": transactionA, 
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

  // queryDbStatic("restaurants", "ra", false, ["address"]);
  initializeDb();