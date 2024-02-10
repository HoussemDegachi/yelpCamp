const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn, saveReturnTo } = require("../middleware");

router
  .route("/register")
  .get(users.registerForm)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    saveReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.route("/logout").post(isLoggedIn, users.logout);

module.exports = router;
