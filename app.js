const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes")

// !!! nonprod uncomment 
const corsOptions ={
   origin: '*', 
   credentials: true,
   optionSuccessStatus: 200,
}
const PORT = 3001; 
// !!! nonprod uncomment 

const app = express(); 
const restaurants = require('./routes/restaurants.js')
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(require('./routes'));
app.use('/restaurants', restaurants)
app.use(express.json())


app.use(routes)
// app.get('/', (req, res) => { 
//   res.status(200); 
//   let header = baseHeader;
//   res.header = header;
//   console.log("here")
//   return res.send("Welcome to root URL of Server"); 
// });

app.get('/', function(req, res){
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3001);
  console.log('Express started on port 3001');
}






