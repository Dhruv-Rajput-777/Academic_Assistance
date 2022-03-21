const express = require("express");
const { LoginUser, RegisterUser } = require("../controllers/auth");

const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./client/html/" });
});

router.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: "./client/html/" });
});

router.post("/login", LoginUser);

router.post("/signup", RegisterUser);

module.exports = router;
