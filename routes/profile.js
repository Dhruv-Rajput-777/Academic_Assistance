const express = require("express");
const {
  getPosts,
  getSavedPosts,
  deletePost,
  unsavePost,
  getStatistics,
  changePassword,
} = require("../controllers/profile");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.sendFile("profile.html", { root: "./client/html/" });
  }
  return res.redirect("/auth/login");
});

router.get("/getPosts", getPosts);

router.get("/getSavedPosts", getSavedPosts);

router.get("/deletePost", deletePost);

router.get("/unsavePost", unsavePost);

router.get("/getStatistics", getStatistics);

router.post("/changePassword", changePassword);

module.exports = router;
