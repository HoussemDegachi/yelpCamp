const Review = require("../models/Review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const reviewItem = new Review(review);
    reviewItem.author = req.user._id;
    const camp = await Campground.findById(id);
    camp.reviews.push(reviewItem);
    await reviewItem.save();
    await camp.save();
    req.flash("success", "Review posted successfully");
    res.redirect(`/campgrounds/${id}`);
}
  
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/campgrounds/${id}`);
  }