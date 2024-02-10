const User = require("../models/User");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
}
  
module.exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email, password });
      const registerdUser = await User.register(user, password);
      req.login(registerdUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to yelpcamp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
}
  
module.exports.loginForm = (req, res) => {
    res.render("users/login");
}
  
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const returnLink = res.locals.returnTo || "/campgrounds";
    res.redirect(returnLink);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Goodbye!");
      res.redirect("/campgrounds");
    });
}