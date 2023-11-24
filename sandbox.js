const {writeDb} = require('./db')

function initializeDb () {
    // objects
      const userA = {
        first: "Eren",
        last: "Yeager",
        id: "3323-1sf2-oupq-01pa",
        phone: "000-000-000",
        pw: "123123123",
        userRestaurants: ["ra"]
      }

      const userB = {
        first: "Joe",
        last: "Goldberg",
        id: "3323-1sf2-oupq-01pb",
        phone: "000-000-000",
        pw: "123123123",
        userRestaurants: ["ra", "rb"]
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

  // queryDbStatic("restaurants", "ra", false, ["address"]);
  // initializeDb();