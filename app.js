require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
var bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "client/")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/profile", require("./routes/profile"));
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.use("/api", require("./routes/api"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
