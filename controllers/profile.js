const Post = require("../models/post");

const getPosts = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }

    const uploadedPosts = req.user.uploadedPosts;
    let posts = [];
    for (let postId of uploadedPosts) {
      const post = await Post.findById(postId);
      if (!post) continue;
      posts.push({
        id: post.id,
        title: post.title,
        description: post.description,
        timestamp: post.timestamp,
        filetype: post.file.mimetype,
      });
    }
    return res.send(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Unable to fetch posts!" });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }

    const user = req.user;
    const oldSavedPosts = user.savedPosts;
    let updatedSavedPosts = [],
      savedPostsIds = [];

    for (let postId of oldSavedPosts) {
      const post = await Post.findById(postId);
      if (post) {
        updatedSavedPosts.push(post);
        savedPostsIds.push(post.id);
      }
    }

    user.savedPosts = savedPostsIds;
    user.save();

    let posts = [];
    for (let post of updatedSavedPosts) {
      posts.push({
        id: post._id,
        title: post.title,
        description: post.description,
        timestamp: post.timestamp,
        filetype: post.file.mimetype,
      });
    }
    return res.send(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Unable to fetch posts!" });
  }
};

const deletePost = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }

    const postId = req.query.postId;
    const user = req.user;
    const index = user.uploadedPosts.indexOf(postId);
    if (index > -1) {
      user.uploadedPosts.splice(index, 1);
      await user.save();
      await Post.findByIdAndDelete(postId);
      return res.status(200).send({ msg: "Post deleted successfully!" });
    } else {
      return res.status(500).send({ msg: "Post not found!" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Unable to fetch posts!" });
  }
};

const unsavePost = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const user = req.user;
    const postId = req.query.postId;
    const index = user.savedPosts.indexOf(postId);
    if (index > -1) {
      user.savedPosts.splice(index, 1);
      await user.save();
      return res.status(200).send({ msg: "Post unsaved successfully!" });
    } else {
      return res.status(400).send({ msg: "Post not found!" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      msg: "An error occured while unsaving the post! Please try again later.",
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }
    const user = req.user;
    let statistics = {
      upvotes: 0,
      downvotes: 0,
      downloads: 0,
      posts: [],
    };
    for (let postId of user.uploadedPosts) {
      const post = await Post.findById(postId);
      if (!post) continue;
      statistics.upvotes += post.upvoteCount;
      statistics.downvotes += post.downvoteCount;
      statistics.downloads += post.downloads;
      statistics.posts.push({
        title: post.title,
        upvotes: post.upvoteCount,
        downvotes: post.downvoteCount,
        downloads: post.downloads,
      });
    }
    return res.send(statistics);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Unable to fetch stats!" });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect("/auth/login");

    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    await user.changePassword(oldPassword, newPassword);
    
    res.send({ msg: "Password changed successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Unable to change password! " + err.message });
  }
};

module.exports = {
  getPosts,
  getSavedPosts,
  deletePost,
  unsavePost,
  getStatistics,
  changePassword,
};
