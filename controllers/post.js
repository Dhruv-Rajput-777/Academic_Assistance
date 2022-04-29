const Post = require("../models/post");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs");

const addPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    newPost.file = {
      originalFilename: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
    };
    await newPost.save();

    const user = req.user;
    user.uploadedPosts.push(newPost.id);
    await user.save();

    res.status(200).send({ postId: newPost.id });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

const getPost = async (req, res) => {
  let postId = req.query.postId;
  try {
    let post = await Post.findById(postId);
    let modifiedPost = {
      ...post._doc,
      ["upvotes"]: post.upvoteCount,
      ["downvotes"]: post.downvoteCount,
      ["isVoted"]: isPostVoted(req, post),
      ["isSaved"]: isPostSaved(req, postId),
    };
    delete modifiedPost.userId;
    res.status(200).send(modifiedPost);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

const isPostVoted = (req, post) => {
  if (!req.isAuthenticated()) return null;
  const userId = req.user.id;
  if (post.upvotes.includes(userId)) return "upvoted";
  if (post.downvotes.includes(userId)) return "downvoted";
  return null;
};

const isPostSaved = (req, postId) => {
  if (!req.isAuthenticated()) return false;
  const user = req.user;
  if (user.savedPosts.includes(postId)) return true;
  return false;
};

const getFile = async (req, res) => {
  try {
    let gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    if (!gfs) {
      console.log("gfs not found");
      return res
        .status(500)
        .send("Unable to retrieve file currently, please try again later");
    }

    let filename = req.query.filename;
    const files = await gfs.find({ filename }).toArray();
    if (!files[0] || files.length === 0) {
      console.log("No file available");
      return res.status(200).send("No file available");
    }

    const tempFile = fs.createWriteStream("./uploads/" + filename);
    gfs.openDownloadStreamByName(filename).pipe(tempFile);

    const filepath = path.join(__dirname, "..", "uploads", filename);
    tempFile.on("close", () => {
      res.download(filepath);
    });
    // tempFile.on("finish", () => {
    // deleteFile(filepath);
    // });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

const deleteFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(filepath + " deleted");
    });
  }
};

const savePost = async (req, res) => {
  const { postId, isSaved } = req.query;

  try {
    const user = req.user;

    if (isSaved === "true") {
      user.savedPosts = user.savedPosts.filter((id) => id !== postId);
      await user.save();
      return res.status(200).send({ saved: true });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.status(200).send({ saved: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const upvotePost = async (req, res) => {
  let hasUpvoted = false,
    hasDownvoted = false;
  const postId = req.query.postId;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  try {
    let upvotes = 0,
      downvotes = 0;
    if (post.upvotes.includes(userId)) {
      hasUpvoted = true;
    }
    if (post.downvotes.includes(userId)) {
      hasDownvoted = true;
    }
    if (hasUpvoted) {
      return res.status(200).send({ upvotes, downvotes });
    }

    upvotes = 1;
    if (hasDownvoted) {
      post.downvotes = post.downvotes.filter((id) => id !== userId);
      post.downvoteCount--;
      downvotes = -1;
    }
    post.upvotes.push(userId);
    post.upvoteCount++;
    await post.save();
    return res.status(200).send({ upvotes, downvotes });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const downvotePost = async (req, res) => {
  let hasUpvoted = false,
    hasDownvoted = false;
  const postId = req.query.postId;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  try {
    let upvotes = 0,
      downvotes = 0;
    if (post.upvotes.includes(userId)) {
      hasUpvoted = true;
    }
    if (post.downvotes.includes(userId)) {
      hasDownvoted = true;
    }
    if (hasDownvoted) {
      return res.status(200).send({ upvotes, downvotes });
    }

    downvotes = 1;
    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter((id) => id !== userId);
      post.upvoteCount--;
      upvotes = -1;
    }
    post.downvotes.push(userId);
    post.downvoteCount++;
    await post.save();
    return res.status(200).send({ upvotes, downvotes });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  addPost,
  getPost,
  getFile,
  savePost,
  upvotePost,
  downvotePost,
};
