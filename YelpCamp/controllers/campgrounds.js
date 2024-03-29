const Campground = require("../models/campground");
//controller is looking for camground model that doesnt exist in this file until we add it
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
//this passes in the token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
//pass token through when we initialize/instantiate a new mapbox geocoding instance
//mbxGeocoding contains forward and reverse geocoding, we want the forward

//first import what we need from MAPBOX (so the above three)
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds }); //added {campgrounds} 413
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1, //gives you just one result
        })
        .send();
    // res.send(geoData.body.features[0].geometry.coordinates); how it was before 547
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    })); // added 536 and ^^
    campground.author = req.user._id;
    await campground.save();
    console.log(campground); //added 536
    req.flash("success", "Successfully made a new camp!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    console.log(campground);
    if (!campground) {
        req.flash("error", "Can't find that camp!");
        return res.redirect("/campgrounds");
    }
    // console.log(campground); test to see reviews in terminal
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Can't find that camp!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    //const imgs makes us the array
    campground.images.push(...imgs);
    //spread (...) takes the data from the array and passes it into push
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
        //pull is how we pull elements out of an array
        console.log(campground);
    }
    req.flash("success", "Successfully updated camp!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted camp!");
    res.redirect("/campgrounds");
};

//moved all functionality into controller file, and this is where we would go for the logic/implementing every query of our camground model and all the render calls (contollers/campgrounds.js)

//routes/campgrounds.js is where we go to look at the routes and to setup middleware and pass them in the controller methods that weve defined
