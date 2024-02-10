const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.createCamp = async (req, res) => {
  const newCamp = new Campground({
    ...req.body.campground,
    author: req.user._id,
  });
  newCamp.images = req.files.map((image) => ({url: image.path, filename: image.filename}))
  await newCamp.save();
  console.log(newCamp);
  req.flash("success", "Campground created successfully");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.createForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.camp = async (req, res) => {
  const { id } = req.params;
  try {
    const camp = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    return res.render("campgrounds/camp", { camp });
  } catch (err) {
    if (err.kind == "ObjectId") {
      req.flash("error", "Unable to find campground");
      return res.redirect("/campgrounds");
    } else {
      throw err;
    }
  }
};

module.exports.editCamp = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground deleted successfully");
  res.redirect("/campgrounds");
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  try {
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp });
  } catch (err) {
    if (err.kind == "ObjectId") {
      req.flash("error", "Unable to find campground");
      return res.redirect("/campgrounds");
    } else {
      throw err;
    }
  }
};
