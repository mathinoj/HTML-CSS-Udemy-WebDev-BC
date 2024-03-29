const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Viewall = require("../models/viewAll");
const { isLoggedIn, isAuthor, validateCard } = require("../middleware");

const db = mongoose.connection;

router.get(
    "/",
    catchAsync(async (req, res, next) => {
        const allCards = await Viewall.find({});
        res.render("cards/index", { allCards });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("cards/new");
});

router.post(
    "/",
    isLoggedIn,
    validateCard,
    catchAsync(async (req, res, next) => {
        const newCard = new Viewall(req.body.newCard);
        newCard.author = req.user._id;
        await newCard.save();
        req.flash("success", "Successfully made nuevo card!");
        res.redirect(`cards/${newCard._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res, next) => {
        // console.log("curry: " + req.user._id);
        const cardz = await Viewall.findById(req.params.id).populate("author");
        console.log(cardz);
        if (!cardz) {
            req.flash("error", "Card not found!");
            return res.redirect("/cards");
        }
        res.render("cards/show", { cardz });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const newCard = await Viewall.findById(id);
        if (!newCard) {
            req.flash("error", "Card not found, no edit allowed!");
            return res.redirect("/cards");
        }
        res.render("cards/edit", { newCard });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthor,
    validateCard,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const card = await Viewall.findByIdAndUpdate(id, {
            ...req.body.newCard,
        });
        req.flash("success", "Updated a card!");
        res.redirect(`/cards/${card._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCard = await Viewall.findByIdAndDelete(id);
        req.flash("success", "Deleted a card!");
        res.redirect("/cards");
    })
);

module.exports = router;
