//this file is self contained. It connects to mongoose and it uses the model

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers"); //did 3rd
const Campground = require("../models/campground");
//first attempt had require("./models/campground"), but this gave us an error. Its cuz we were looking at the campground model, which is in the models directory, but I'm in a separate directory: seeds. Therefore you need to backout one, and to do this you add another '.' to './models/campground' which will look like line 4.

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected mayngs");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: "burple field" });
    // await c.save(); DID THESE TWO AS A TEST FIRST
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6302476a8ad37dd5d4952c89",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius amet quidem temporibus. Est officiis enim, quibusdam quasi molestiae sequi minus hic optio porro aut ipsam nesciunt veritatis cumque recusandae! Eum!",
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dmjfoztry/image/upload/v1661631742/YelpCamp/ski0utauouyxy7updk5s.jpg",
                    filename: "YelpCamp/ski0utauouyxy7updk5s",
                },
                {
                    url: "https://res.cloudinary.com/dmjfoztry/image/upload/v1661631777/YelpCamp/kgobrifzsvjn1v3e3igu.jpg",
                    filename: "YelpCamp/kgobrifzsvjn1v3e3igu",
                },
            ],
        });
        await camp.save();
    }
};

//set the loop to run 50 times to get a city

seedDB().then(() => {
    mongoose.connection.close();
});
//close our database connection. seedDB returns a promise cuz its an async function. Call mongoose.connection.close to close.
