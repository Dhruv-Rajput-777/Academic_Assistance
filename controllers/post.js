const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

const addPost = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ err });
      }

      const post = new Post(fields);
      post.file = files.file;
      const data = await post.save();

      let user = req.user;
      user.uploadedPosts.push(data.id);
      await user.save();

      res.status(200).send({ postId: data.id });
    });
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
};

const getPost = async (req, res) => {
  let postId = req.query.postId;
  try {
    let post = await Post.findById(postId);
    let modifiedPost = {
      ...post._doc,
      ["upvotes"]: post.upvotes.length,
      ["downvotes"]: post.downvotes.length,
      ["isVoted"]: isPostVoted(req, post),
      ["isSaved"]: isPostSaved(req, postId),
      ["filename"]: post.file.originalFilename,
    };
    delete modifiedPost.userId;
    delete modifiedPost.file;
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
  let postId = req.query.postId;
  try {
    let post = await Post.findById(postId);
    const readStream = fs.createReadStream(post.file.filepath);
    readStream.pipe(res);

    post.downloads++;
    await post.save();
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
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
      downvotes = -1;
    }
    post.upvotes.push(userId);
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
      upvotes = -1;
    }
    post.downvotes.push(userId);
    await post.save();
    return res.status(200).send({ upvotes, downvotes });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const deletePost = async (req, res) => {};

module.exports = {
  addPost,
  deletePost,
  getPost,
  getFile,
  savePost,
  upvotePost,
  downvotePost,
};