const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile("support.html", { root: "./client/html/" });
});

module.exports = router;
