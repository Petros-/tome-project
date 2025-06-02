// for defining the functions that will access the database of artworks

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Multer = require('multer');
const Artwork = require('../models/artwork');

// configuration for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// for uploading images
module.exports.handleUpload = async (file) => {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

// create an artwork
module.exports.createArtwork = async (userId, artObject) => {
    if (!userId || !artObject) {
        throw new Error("missing some key details like the artwork details or the userId of the person posting this")
    }
    artObject.createdBy = userId;
    artObject.userId = userId;
    const createdArtwork = await Artwork.create({ ...artObject, userId });
    return createdArtwork;
};

// get all the artworks
module.exports.getArtworks = async () => {
    const artworks = await Artwork.find();
    return artworks.map(a => ({
        id: a._id.toString(),
        title: a.title,
        medium: a.medium,
        image: a.image
    }));
};

// get all the artworks for a specific user
module.exports.getArtworksByUserId = async (userId) => {
    return Artwork.find({ createdBy: userId });
};

// get a specific artwork
module.exports.getArtworkById = async (id) => {
    const artwork = await Artwork.findById(id);
    return artwork;
};

// edit an artwork
module.exports.updateArtwork = async (id, artworkToUpdate) => {
    if (!id || !artworkToUpdate) {
        throw new Error("Missing the item id or the data to update it with")
    }
    const updatedArtwork = await Artwork.findByIdAndUpdate(id, artworkToUpdate, {
        new: true,
        runValidators: true
    });
    return updatedArtwork;
}