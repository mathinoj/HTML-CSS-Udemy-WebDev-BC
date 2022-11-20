const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { spanishSchemaAlso } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Travelall = require("../models/viewAllTravel");
const { isLoggedIn } = require("../middleware");

///TRAVEL
const validateTravel = (req, res, next) => {
    const { error } = spanishSchemaAlso.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("new", isLoggedIn, (req, res) => {
    res.render("/travel/new");
});

///TRAVEL
router.get(
    "/",
    // isLoggedIn,
    catchAsync(async (req, res) => {
        const viewAllTravel = await Travelall.find({});
        res.render("travel/index", { viewAllTravel });
    })
);

///TRAVEL
router.get("/new", (req, res) => {
    res.render("travel/new");
});

///TRAVEL
router.post(
    "/",
    isLoggedIn,
    validateTravel,
    catchAsync(async (req, res, next) => {
        const newTravel = new Travelall(req.body.travel);
        await newTravel.save();
        req.flash("success", "Successfully listed a travel!");
        res.redirect(`/travel/${newTravel._id}`);
    })
);

///TRAVEL
router.get(
    "/:id",
    // isLoggedIn,
    catchAsync(async (req, res) => {
        const viewTravelId = await Travelall.findById(req.params.id).populate(
            "reviews"
        );
        if (!viewTravelId) {
            req.flash("error", "No lo encuentra este viaje!");
            return res.redirect("/travel");
        }
        res.render("travel/show", { viewTravelId });
    })
);

///TRAVEL
router.get(
    "/:id/edit",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const editTravel = await Travelall.findById(req.params.id);
        if (!editTravel) {
            req.flash("error", "Cannot be founded!");
            return res.redirect("/travel");
        }
        res.render("travel/edit", { editTravel });
    })
);

///TRAVEL
router.put(
    "/:id",
    isLoggedIn,
    validateTravel,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const editedTravel = await Travelall.findByIdAndUpdate(id, {
            ...req.body.travel,
        });
        req.flash("Updated a travel!");
        res.redirect(`/travel/${editedTravel._id}`);
    })
);

//TRAVEL
router.delete(
    "/:id",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Travelall.findByIdAndDelete(id);
        req.flash("Deleted a travel.");
        res.redirect("/travel");
    })
);

module.exports = router;
