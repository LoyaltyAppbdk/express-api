const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const PORT = 5000; 

const app = express(); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(require('./routes'));
app.use(cors(corsOptions))
app.use(express.json())
app.listen((error) => { 
  if(!error) 
      console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
  else 
      console.log("Error occurred, server can't start", error); 
  } 
); 


