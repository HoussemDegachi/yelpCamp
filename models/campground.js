const mongoose = require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
  title: String,
  images: [
    ImageSchema
  ],
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
