const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./db');
const userController = require("./routes/api/userController")
const cors = require('cors');


const app = express();
console.log(process.env.NODE_ENV);
const stage = process.env.NODE_ENV
const PORT = stage === "production" ? 80 : 4000;

app.use(cors({
  origin: 'http://localhost:3000',  // replace with your application's URL
  credentials: true,  // IMPORTANT: enable credentials. This is needed for cookies to work
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
//   next();
// });

app.use(morgan("dev"));
app.use(helmet());

connectDB();

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use("/api/v1/user", userController)

app.listen(PORT, console.log(`API is listening on port ${PORT}`));



// http://localhost:4000/api/v1/userController/create/food/bank

// API call:  http://localhost:4000/api/v1/userController/create/restaurant
// req.body {
//   name: "justin"
//}

// req.body.name --> justin 