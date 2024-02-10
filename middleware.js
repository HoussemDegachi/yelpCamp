const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");
const Campground = require("./models/campground");
const { reviewSchema } = require("./schemas");
const Review = require("./models/Review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in");
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

module.exports.saveReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports.isAuthorized = async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(currentUser._id)) {
    req.flash("error", "Permission denied: You are not authorized");
    res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuth = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!req.user._id.equals(review.author)) {
    req.flash("error", "Permession deneined: You are not authorized");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
