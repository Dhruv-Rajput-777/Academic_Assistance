const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const mongoose = require("mongoose");
const path = require("path");

const {
  addPost,
  getPost,
  getFile,
  getFileData,
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

router.get("/file", (req, res) => {
  res.sendFile("file.html", { root: "./client/html/" });
});

// create storage engine for multer
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  limits: { maxFileSize: 50 * 1024 * 1024 },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

router.post("/add", upload.single("file"), addPost);

router.get("/getPost", getPost);

router.get("/getFile", getFile);

router.get("/savePost", savePost);

router.get("/upvotePost", upvotePost);

router.get("/downvotePost", downvotePost);

module.exports = router;
