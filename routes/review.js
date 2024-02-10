const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuth, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

router
  .route("/")
  .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewAuth, catchAsync(reviews.deleteReview));

module.exports = router;
