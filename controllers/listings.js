const Listing = require("../models/listing");
// const getCoordForAddress = require("../utils/location");
const getCoordinates = require("../utils/location");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {
    try {
        const address = req.body.listing.location;
        const coords = await getCoordinates(address);
        console.log('Coordinates:', coords);
      } catch (err) {
        console.error('Failed to fetch coordinates:', err.message);
      }
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};