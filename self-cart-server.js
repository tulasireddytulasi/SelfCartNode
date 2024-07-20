const express = require("express");
const Joi = require("joi");
const app = express();
var cors = require("cors");
const fs = require("fs");
const ValidateAccessToken = require("./middleware/verify-auth-token.js");
const Responses = require("./common/responses.js");

const connectDB = require("./database/init.js");
connectDB(); // connect to mongoDB

app.use(cors());
app.use(express.json());

let server = require("http").createServer(app);

const PORT = Number(process.env.PORT) || 7000;

global.functions = require("./common/send-response.js");
app.disable("x-powered-by");
const authRoute = require("./routes/auth-route.js");
const staticDataRoute = require("./routes/static-data-route.js");
const user = require("./routes/users.js");

const dummyData = fs.readFileSync(
  `${__dirname}/json_files/products.json`,
  "utf-8"
);
const productData = JSON.parse(dummyData);

app.get("/", function (req, res) {
  res.send("WELCOME TO Self Cart");
});

app.get("/itemsList", function (req, res) {
  res.send(productData);
});

app.all("*", verifyAuth);

app.use("/", authRoute);
app.use("/", staticDataRoute);
app.use("/", user);

async function verifyAuth(req, res, next) {
  try {
    const url = req.originalUrl;
    const bypassedUrls = /otp/gi;
    const isReqExcludedToken = url.match(bypassedUrls);

    if (!isReqExcludedToken) {
      const tokenResult = await ValidateAccessToken(req);
      if (!tokenResult)
        return functions.sendResponse(res, Responses.UNAUTHORIZED_REQUEST);
      const { id } = tokenResult.message;
      req.userId = id;
    }

    next();
  } catch (error) {
    return functions.sendResponse(res, Responses.UNAUTHORIZED_REQUEST);
  }
}

// To run in browser : http://localhost:8000/
// CMD: npm run dev

server.listen(PORT, "127.0.0.1" || "localhost", function () {
  console.log(`server up and running on PORT : ` + PORT);
});
