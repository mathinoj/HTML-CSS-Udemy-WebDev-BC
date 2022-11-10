const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const viewAll = require("./models/viewAll");

mongoose.connect("mongodb://localhost:27017/Spanish", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database Connected Mayngz");
});

const app = express();

app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/addSpanish", async (req, res) => {
    // res.send("home landing");
    // res.render("home");
    const spanish = new spanishCard({
        text: "How are you?",
    });
    await spanish.save();
    res.send(spanish);
});

app.listen(3000, () => {
    console.log("Connected port 3000");
});
