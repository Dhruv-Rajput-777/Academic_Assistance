const express = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  checkUsername,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./client/html/" });
});

router.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: "./client/html/" });
});

router.post("/login", loginUser);

router.post("/signup", registerUser);

router.get("/logout", logoutUser);

router.get("/getUser", getUser);

router.get("/checkUsername", checkUsername);

module.exports = router;
