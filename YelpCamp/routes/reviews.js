const express = require("express");
const router = express.Router({ mergeParams: true });
//routers get seperate params. Now all of the params from app.js will be merged from alongside the params in review.js (this file)
//if we need accesss to the :id param in app.js ('/campgrounds/:id/reviews') or more params that we define in app.js when were using the route then we need to make sure we set mergeParams: true
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware"); // added 523
//^524
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews"); //527
const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// const validateReview = (req, res, next) => { MOVED to middleware.js 523
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

// router.post(
//     "/",
//     isLoggedIn,
//     validateReview,
//     catchAsync(async (req, res) => {
//         // res.send("You MAYD it");
//         const campground = await Campground.findById(req.params.id);
//         const review = new Review(req.body.review);
//         review.author = req.user._id; //524
//         campground.reviews.push(review);
//         await review.save();
//         await campground.save();
//         req.flash("success", "Created new review!");
//         res.redirect(`/campgrounds/${campground._id}`);
//     })
// );

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// router.delete(
//     "/:reviewId",
//     isLoggedIn,
//     isReviewAuthor,
//     catchAsync(async (req, res) => {
//         const { id, reviewId } = req.params;
//         await Campground.findByIdAndUpdate(id, {
//             $pull: { reviews: reviewId },
//         });
//         await Review.findByIdAndDelete(reviewId);
//         req.flash("success", "Successfully deleted review!");
//         res.redirect(`/campgrounds/${id}`);
//     })
// );

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;
