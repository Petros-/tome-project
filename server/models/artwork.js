// for defining the structure of artworks
const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
    title: {type:String},
    medium: {type:String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: {type: String},
    // date: {type:Date},
    // tags: {type: [String]},
    // sold: {type: Boolean},
    // height: {type: String},
    // width: {type: String},
    // framed: {type: Boolean},
    // region: {type: [String]},
    // currentLocation: {type: String},
    // availability: {type: String, default: 'Available'}
}, {
    timestamps: true
});

module.exports = mongoose.model("Artwork", artworkSchema)