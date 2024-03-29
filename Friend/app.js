const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const { cardSchema } = require("./schema.js");
const Viewall = require("./models/viewAll");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/friend", {});

const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const friendRoutes = require("./routes/friends");

const cards = require("./routes/cards");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB Connd");
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
    secret: "examplesecretdontdoforreal",
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

//TEST FROM SECTION 511
// app.get("/fakeUser", async (req, res, next) => {
//     const user = new User({ email: "zt@gmail.com", username: "zed" });
//     const newUser = await User.register(user, "secretpword");
//     res.send(newUser);
// });

app.use("/cards", cards);

app.use("/", userRoutes);
app.use("/cards", cardRoutes);
app.use("/", friendRoutes);

app.get("/", (req, res) => {
    // res.send("test if it wrx");
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Someting wrong!";
    res.status(statusCode).render("error", { err });
});

app.use((err, req, res, next) => {
    res.send("Sutin went wrong!");
});

app.listen(3000, () => {
    console.log("Connd to Port 3000");
});
