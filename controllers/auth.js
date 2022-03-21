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

const LoginUser = (req, res) => {
  const user = { username: req.body.username, password: req.body.password };
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.send(err);
    }
    if (!user) {
      return res.send(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.send(err);
      }
      return res.redirect("/profile");
    });
  })(req, res);
};

const RegisterUser = (req, res) => {
  const { username, password } = req.body;
  Users.register({ username }, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/signup");
    }
    passport.authenticate("local")(req, res, () => {
      return res.redirect(req.originalUrl || "/posts");
    });
  });
};

module.exports = { LoginUser, RegisterUser };
