const express = require("express");
const router = express.Router();

const {
  addPost,
  getPost,
  getFile,
  upvotePost,
  downvotePost,
  savePost,
} = require("../controllers/post");

router.get("/", (req, res) => {
  res.sendFile("post.html", { root: "./client/html/" });
});

router.get("/add", (req, res) => {
  res.sendFile("addPost.html", { root: "./client/html/" });
});

router.post("/add", addPost);

router.get("/getPost", getPost);

router.get("/getFile", getFile);

router.get("/savePost", savePost);

router.get("/upvotePost", upvotePost);

router.get("/downvotePost", downvotePost);

module.exports = router;
