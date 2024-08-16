const express = require("express");
const dotenv = require("dotenv");
const app = express();
const errorMiddleware = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const connectWithMongo = require("./database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Import
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

// Middleware for Error Handling
app.use(errorMiddleware);

connectWithMongo();

module.exports = app;
