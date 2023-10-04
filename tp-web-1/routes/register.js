var express = require("express");
var router = express.Router();
var user = require("../models/user");
var passport = require("passport");
var { redirectIfAuthenticated } = require("../controler/authControler");

router.get("/", redirectIfAuthenticated, function (req, res) {
  const error = req.query.error;
  res.render("register", { user: req.user, error });
});

router.post("/", function (req, res) {
  const isAdmin = req.body.isAdmin === "true";

  const newUser = new user({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    username: req.body.username,
    isAdmin: isAdmin,
  });

  user.register(newUser, req.body.password, function (err) {
    if (err) {
      // Handle registration error
      let errorMessage = "An error occurred during registration.";

      // Check for specific error codes or messages and customize the error message accordingly
      if (err.name === "UserExistsError") {
        errorMessage = "A user with that username already exists.";
      } else if (err.message.includes("is required")) {
        errorMessage = "All fields are required.";
      }

      return res.render("register", { error: errorMessage });
    }

    passport.authenticate("local")(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return res.render("register", {
            error: "An error occurred during session creation.",
          });
        }

        req.session.passport.userId = req.user._id;
        req.session.passport.admin = isAdmin;
        res.redirect("/");
      });
    });
  });
});

module.exports = router;
