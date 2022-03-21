const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.sendFile("profile.html", { root: "./client/html/" });
  }
  return res.redirect("/auth/login");
});

router.get("/getUser", (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(req.user);
  }
  return res.send(null);
});

module.exports = router;
