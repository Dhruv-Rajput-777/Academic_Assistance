require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
var bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, "client/")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/profile", require("./routes/profile"));
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/posts", (req, res) => {
  res.sendFile(__dirname + "/client/html/index.html");
});

app.listen(3000, () => {
  console.log("Server is running");
});
