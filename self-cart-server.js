const express = require("express");
const Joi = require("joi");
const app = express();
var cors = require("cors");
const fs = require("fs");

const connectDB = require("./database/init.js");
connectDB(); // connect to mongoDB

app.use(cors());
app.use(express.json());

let server = require("http").createServer(app);

const PORT = Number(process.env.PORT) || 7000;

const dummyData = fs.readFileSync(
  `${__dirname}/json_files/products.json`,
  "utf-8"
);
const productData = JSON.parse(dummyData);

app.get("/", function (req, res) {
  res.send("WELCOME TO MAYA STORIES WORLD");
});

app.get("/itemsList", function (req, res) {
  res.send(productData);
});

// To run in browser : http://localhost:8000/

server.listen(PORT, "127.0.0.1" || "localhost", function () {
  console.log(`server up and running on PORT : ` + PORT);
});
