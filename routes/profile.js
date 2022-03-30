const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()){
    return res.sendFile("profile.html", { root: "./client/html/" });
  }
  return res.redirect("/auth/login");
});

module.exports = router;
