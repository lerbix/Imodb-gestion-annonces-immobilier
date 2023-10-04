var express = require("express");
var router = express.Router();
var user = require("../models/user");
var passport = require("passport");
var { redirectIfAuthenticated } = require("../controler/authControler");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle any unexpected errors
      console.error(err);
      return res.render("error", { error: "An unexpected error occurred" });
    }

    if (!user) {
      // Authentication failed, redirect to login with an error message
      return res.redirect("/login?error=Invalid%20username%20or%20password");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.render("error", {
          error: "An unexpected error occurred during login",
        });
      }

      req.session.passport.idUtilisateur = user._id;
      req.session.passport.admin = user.isAdmin;

      // Authentication succeeded, redirect to the desired page
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/", redirectIfAuthenticated, function (req, res) {
  const error = req.query.error;
  res.render("login", { error, user: req.user });
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
