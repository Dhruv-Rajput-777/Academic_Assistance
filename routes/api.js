const express = require("express");
const router = express.Router();

const { getSuggestions, getPosts } = require("../controllers/api");

router.get("/suggestions", getSuggestions);

router.post("/getPosts", getPosts);

module.exports = router;
