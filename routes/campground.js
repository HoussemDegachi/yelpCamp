const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  isLoggedIn,
  validateCampground,
  isAuthorized,
} = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    validateCampground,
    upload.array("image"),
    catchAsync(campgrounds.createCamp)
  );

router.route("/new").get(isLoggedIn, campgrounds.createForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.camp))
  .put(
    isLoggedIn,
    isAuthorized,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.editCamp)
  )
  .delete(isLoggedIn, isAuthorized, catchAsync(campgrounds.deleteCamp));

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthorized, catchAsync(campgrounds.editForm));

module.exports = router;
