if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ejsMate = require("ejs-mate");
// const Joi = require("joi"); REMOVED this cuz we exporting it from schema.js
const {
    spanishSchema,
    spanishSchemaAlso,
    reviewSchema,
} = require("./schemas.js");
// ^^^^ these are not related to the schema we setup, in fact we could've named them anything
const catchAsync = require("./utils/catchAsync");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport"); //510
const LocalStrategy = require("passport-local");
const User = require("./models/user");
// const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const Viewall = require("./models/viewAll");
const Travelall = require("./models/viewAllTravel");
const Travel = require("./models/viewAllTravel");

const Review = require("./models/review");
const { setgroups } = require("process");

const userRoutes = require("./routes/users");
const viewAllTravel = require("./routes/travel");
const viewYourTravel = require("./routes/travel");
const viewAllCamp = require("./routes/card");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/Spanish", {});

const db = mongoose.connection;

//this logic checks to see if there is an error
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database Connected Mayngz");
});
//this logic checks to see if there is an error^^^^^^^

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
//for the new card submission we wont see any of our text submissions because the request body hasn't been parced so we tell express to parse the body by doing the app.use...
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);

const sessionConfig = {
    secret: "dontdothisinproduction",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

// app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// const passport = require("passport");

// const validateCard = (req, res, next) => {
//     const { error } = spanishSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

// ///TRAVEL
// const validateTravel = (req, res, next) => {
//     const { error } = spanishSchemaAlso.validate(req.body);
//     if (error) {
//         const msg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

app.use("/", userRoutes);
app.use("/travel", viewAllTravel);
app.use("/cards", viewAllCamp);
app.use("/travel/:id/reviews", reviews);

app.get("/", (req, res) => {
    // res.send("hello cards");

    res.render("home");
});

// app.get(
//     "/cards",
//     catchAsync(async (req, res) => {
//         const viewAllCamp = await Viewall.find({});
//         res.render("cards/index", { viewAllCamp });
//     })
// );

app.get("/test/test", async (req, res) => {
    const randomCard = await Viewall.find({});
    //         res.render("cards/show", { viewCampId });
    res.render("test/test", { randomCard });
});

// app.get("/travel/userTravel/:id", async (req, res) => {
//     const viewYourT = await Travelall.find({});
//     res.render("travel/userTravel", { viewYourT });
// });

// ///TRAVEL
// app.get(
//     "/travel",
//     catchAsync(async (req, res) => {
//         const viewAllTravel = await Travelall.find({});
//         res.render("travel/index", { viewAllTravel });
//     })
// );

// app.get("/cards/new", (req, res) => {
// const card = new Viewall({ english: "What", spanish: "Que" });
// await card.save();
// res.render("cards/new");
//BEFORE, THIS ROUTE WAS BELOW '/cards/:id/' but we moved it here because order matters
// });

// ///TRAVEL
// app.get("/travel/new", (req, res) => {
//     res.render("travel/new");
// });

///////////////USED joi for server side validation!!!!!!!!!!!

// app.post(
//     "/cards",
//     validateCard,
//     catchAsync(async (req, res, next) => {
//         // const SpanishSchema = Joi.object({
//         //     card: Joi.object({
//         //         card: Joi.string().required,
//         //         hint: Joi.string().required,
//         //         english: Joi.string().required,
//         //         spanish: Joi.string().required,
//         //         hintOne: Joi.string().required,
//         //         hintTwo: Joi.string().required,
//         //     }).required(),
//         // });
//         // const { error } = SpanishSchema.validate(req.body);
//         // if (error) {
//         //     const msg = error.details.map((el) => el.message).join(",");
//         //     throw new ExpressError(msg, 400);
//         // }
//         // if (!req.body.card) throw new ExpressError("Invalid card data!", 400);
//         const newCard = new Viewall(req.body.card);
//         // const newCardHint = new Viewall(req.body.hint);
//         await newCard.save();
//         // await newCardHint.save();
//         res.redirect(`/cards/${newCard._id}`);
//         // res.send(req.body);
//     })
// );

// ///TRAVEL
// app.post(
//     "/travel",
//     validateTravel,
//     catchAsync(async (req, res, next) => {
// const spanishSchemaAlso = Joi.object({
//     travel: Joi.object({
//         image: Joi.string().required(),
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//     }).required(),
// });
// const { error } = spanishSchemaAlso.validate(req.body);
// if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(msg, 400);
// }
// console.log(result);
// if (!req.body.travel)
//     throw new ExpressError("Invalid travel data!", 400);
//         const newTravel = new Travelall(req.body.travel);
//         await newTravel.save();
//         res.redirect(`/travel/${newTravel._id}`);
//     })
// );
//if there is an error we will catch it with catchAsync and pass it onto next(), which is under app.use((err, req, res, next))

// app.post(
//     "/travel/:id/reviews",
//     validateReview,
//     catchAsync(async (req, res) => {
//         const selectedTravel = await Travelall.findById(req.params.id);
//         const review = new Review(req.body.review); //review is from review[...]
//         selectedTravel.reviews.push(review);
//         await review.save();
//         await selectedTravel.save();
//         res.redirect(`/travel/${selectedTravel._id}`);
//         // res.send("you did it");
//     })
// );

// app.get(
//     "/cards/:id",
//     catchAsync(async (req, res) => {
//         const viewCampId = await Viewall.findById(req.params.id);
//         res.render("cards/show", { viewCampId });
//     })
// );

// app.get("/travel/userTravel/:id", async (req, res) => {
//     const viewYourT = await Travelall.find({});
//     res.render("travel/userTravel", { viewYourT });
// });

// app.get('/travel/userReviews/:id',)

// ///TRAVEL
// app.get(
//     "/travel/:id",
//     catchAsync(async (req, res) => {
//         const viewTravelId = await Travelall.findById(req.params.id).populate(
//             "reviews"
//         );
//         res.render("travel/show", { viewTravelId });
//     })
// );

// app.get(
//     "/cards/:id/edit",
//     catchAsync(async (req, res) => {
//         const editCard = await Viewall.findById(req.params.id);
//         res.render("cards/edit", { editCard });
//     })
// );

// ///TRAVEL
// app.get(
//     "/travel/:id/edit",
//     catchAsync(async (req, res) => {
//         const editTravel = await Travelall.findById(req.params.id);
//         res.render("travel/edit", { editTravel });
//     })
// );

// app.put(
//     "/cards/:id",
//     validateCard,
//     catchAsync(async (req, res, next) => {
//         const { id } = req.params;
//         const editedCard = await Viewall.findByIdAndUpdate(id, {
//             ...req.body.card,
//         });
//         res.redirect(`/cards/${editedCard._id}`);
//         // res.send("it TWERKED");
//     })
// );

// ///TRAVEL
// app.put(
//     "/travel/:id",
//     validateTravel,
//     catchAsync(async (req, res, next) => {
//         const { id } = req.params;
//         const editedTravel = await Travelall.findByIdAndUpdate(id, {
//             ...req.body.travel,
//         });
//         res.redirect(`/travel/${editedTravel._id}`);
//     })
// );

// app.delete(
//     "/cards/:id",
//     catchAsync(async (req, res) => {
//         const { id } = req.params;
//         await Viewall.findByIdAndDelete(id);
//         res.redirect("/cards");
//     })
// );

// //TRAVEL
// app.delete(
//     "/travel/:id",
//     catchAsync(async (req, res) => {
//         const { id } = req.params;
//         await Travelall.findByIdAndDelete(id);
//         res.redirect("/travel");
//     })
// );

// app.delete(
//     "/travel/:id/reviews/:reviewId",
//     catchAsync(async (req, res) => {
//         const { id, reviewId } = req.params;
//         await Travelall.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//         await Review.findByIdAndDelete(reviewId);
//         res.redirect(`/travel/${id}`);
//         // res.send("deleted me");
//     })
// );

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Suntin went wrong!";
    res.status(statusCode).render("error", { err });
    // res.send("Suntin went wrong!");
});

app.listen(3000, () => {
    console.log("Connected port 3000");
});
