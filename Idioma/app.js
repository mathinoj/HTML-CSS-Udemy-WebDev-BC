const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const Idioma = require("./models/idioma");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { cardSchema } = require("./schemas.js");

mongoose.set("strictQuery", true); //ADDED THIS TO REMOVE TERMINAL MESSAGE BOUT DEPRECIATION. 21JAN2023 1522
mongoose.connect("mongodb://localhost:27017/idioma", {});

const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards"); //changed to cardRoutes mod 509 18012023 427pm
const bodyParser = require("body-parser");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB connected!");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(express.static("public")); TEST 2 MOD 491
//but then we add in this and we get the alert from TEST 1 MOD 491
app.use(express.static(path.join(__dirname, "public"))); //FINAL MOD 491

const sessionConfig = {
    secret: "exampleofsecretnottobedoneforreal",
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
    //HERE we print the entire session so we can see whats going on
    //if we go to the ALL CARDS page there is nothing in the terminal that has to deal with the 'returnTo', but if we go to 'make a card' we are redirected to login and the session (in the terminal) includes a returnTo '/cards/new'
    //Then when we actually do the logging in (user.js), which is in the router.post('/login')
    res.locals.currentUser = req.user;
    console.log("CURRENT USER: " + res.locals.currentUser);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
//on REQ there iss something automatically put there for us, its req.user, which contains info bout the user.
//he does a: console.log('REQ.USER...', req.user). He says req.user will automatically be filled in with the deserialized info from the session. Session stores the serialized user, PASSPORT is going to deserialize it and fill in req.user with that data. So TO TEST the CONSLOG you have to login and then go to 'make a card' THEN go to to terminal. There you should see the user information that is stored in the session. So what you see is the req.user that is coming from the session thanks to PASSPORT. THIS EXAMPLE IS IN MIDDLEWARE.JS
//currentUser would show the req.user, it will basically show that someone is LOGGED IN.

//can name it anything you want

//res.locals.success/error are accessible in every template, so even though theyre local they are actually global (meaning theyre accessible in every template)
//so rather than add req.user to every single request we add it to res.locals, which allows us to have access to req.user in all templates. So now in all the templates we should have access to currentUser

//this is demonstrating how we will register a user. so below we hardcode the creation of a new user.
// app.get("/fakeUser", async (req, res, next) => {
//     const user = new User({ email: "vic@gmail.com", username: "vic" });
//     const newUser = await User.register(user, "secretpasswordvic");

//     res.send(newUser);
//     //THIS IS A TEST DONE IN MOD 512 TO SEE PASSPORT WORKING. WITH THIS, when you go to /fakeUser, you will see the HASHED/SALTED pword
// });

app.use("/", userRoutes);
app.use("/cards", cardRoutes); //added mod 489

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page no find", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("Connected to pizort 3000!");
});

//The idea of a session is that we store information on the server side and then we send a little cookie back to the client that says, Here's your key, here's the ID you need to unlock that session.
//But just remember this idea of having this cookie that is sent to my browser and this cookie does not contain any of the information in the session. The session can store a whole lot more information. I could have a whole shopping cart in there, but it does not send any of that data to me to be stored as a cookie. The only information it sends to me is this session ID. That session ID then is sent on every subsequent request. And then it's going to make sure, first of all, that it's not been tampered with and still is a valid session. ID It takes that and then it looks deep in this session store that it has and it tries to find information that corresponds to that ID and if it does, that's what we have access to in request session dot count

//http only if this is included the cookie cant be accessed through client-side scripts and as a result even if a cross-site scripting flaw exists and a user accidentally accesses a link that exploits this flaw, the browser will not reveal the cookie to the third party. THIS IS BASICALLY A security measure
// https://www.cookiepro.com/knowledge/httponly-cookie/
