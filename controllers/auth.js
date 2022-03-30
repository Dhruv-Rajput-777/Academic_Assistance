const passport = require("passport");
const Users = require("../models/users.js");

passport.use(Users.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

const loginUser = (req, res) => {
  const user = { username: req.body.username, password: req.body.password };
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(401).send(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(user);
    });
  })(req, res);
};

const registerUser = (req, res) => {
  const { username, password } = req.body;
  Users.register({ username }, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/signup");
    }
    passport.authenticate("local")(req, res, () => {
      return res.redirect("/");
    });
  });
};

const logoutUser = (req, res) => {
  req.logout();
  return res.redirect("/");
};

const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(req.user._id);
  }
  return res.status(400).send(null);
};

module.exports = { loginUser, registerUser, logoutUser, getUser };
