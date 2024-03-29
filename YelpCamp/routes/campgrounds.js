const express = require("express");
const router = express.Router({ mergeParams: true });
const campgrounds = require("../controllers/campgrounds"); //526
const catchAsync = require("../utils/catchAsync");
// const { campgroundSchema, reviewSchema } = require("../schemas.js");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
//523^^ need to require author and validate
const multer = require("multer");
const { storage } = require("../cloudinary"); //storage in cloudinary index.js 535
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage }); //535

// const ExpressError = require("../utils/ExpressError"); not using got rid 523
const Campground = require("../models/campground");

router.route("/").get(catchAsync(campgrounds.index)).post(
    isLoggedIn,
    upload.array("image"), //added 538
    validateCampground, //in real world you dont want to upload image before validate the other data but multer works first uploads everythin while its parsing and then it sends us the parsed body/files that we have access to in req.body
    catchAsync(campgrounds.createCampground)
    //added back in 538^^^^
    // .post(upload.array("image"), (req, res) => {  // removed 538
    //array can make a multiple file input if we go to the file input at set it to mulitple
    // console.log(req.body, req.files); // removed 538
    // res.send("it twerked"); // removed 538
    //in order to parse multipart forms we need to use the middleware - Multer. Multer parses or handles multipart form data, which is primarily used for uploading files.
    //multer parses json or url encoded data from forms
    // });  // removed 538
); // added 538

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//this needs to go before the show page!!!

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor, //523
        upload.array("image"),
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(
        isLoggedIn,
        isAuthor, //523
        catchAsync(campgrounds.deleteCampground)
    );

// router.get("/new", isLoggedIn, (req, res) => {
// if (!req.isAuthenticated()) {
//     req.flash("error", "must be signed in");
//     return res.redirect("/login");
// }
//     res.render("campgrounds/new");
// });

// router.post(
//     "/",
//     isLoggedIn,
//     validateCampground,
//     catchAsync(async (req, res, next) => {
//         // if (!req.body.campground)
//         //     throw new ExpressError("Invalid camp data", 400);

//         const campground = new Campground(req.body.campground);
//         campground.author = req.user._id;
//         await campground.save();
//         req.flash("success", "Successfully made a new camp!");
//         res.redirect(`/campgrounds/${campground._id}`);
//     })
// );

// router.get(
//     "/:id/edit",
//     isLoggedIn,
//     isAuthor, //523
//     catchAsync(async (req, res) => {
//         const { id } = req.params;
//         const campground = await Campground.findById(id);
//         if (!campground) {
//             req.flash("error", "Can't find that camp!");
//             return res.redirect("/campgrounds");
//         }
//         // if (!campground.author.equals(req.user._id)) { 523
//         //     req.flash("error", "you aint allowed to does that!"); 523
//         //     return res.redirect(`/campgrounds/${id}`); 523
//         // }
//         res.render("campgrounds/edit", { campground });
//     })
// );

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

// router.put(
//     "/:id",
//     isLoggedIn,
//     isAuthor, //523
//     validateCampground,
//     catchAsync(async (req, res) => {
//         // res.send("it worked"); // this is a test!!
//         const { id } = req.params;
//         // const campground = await Campground.findById(id);
//         // if (!campground.author.equals(req.user._id)) {
//         //     req.flash("error", "you aint allowed to does that!");
//         //     return res.redirect(`/campgrounds/${id}`);
//         // }
//         const campground = await Campground.findByIdAndUpdate(id, {
//             //523
//             ...req.body.campground,
//         });
//         //... is the spread operator. Spreads into the object {...req.body.campground}
//         req.flash("success", "Successfully updated camp!");
//         res.redirect(`/campgrounds/${campground._id}`);
//     })
// );

// router.delete(
//     "/:id",
//     isLoggedIn,
//     isAuthor, //523
//     catchAsync(async (req, res) => {
//         const { id } = req.params;
//         await Campground.findByIdAndDelete(id);
//         req.flash("success", "Successfully deleted camp!");
//         res.redirect("/campgrounds");
//     })
// );

module.exports = router;
