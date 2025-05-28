// for defining the structure of users or accounts
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    password: {type: String, required: true},
    email: {type: String, required: true},
    // set the roles property to an array of strings
    // with the default set to viewer
    // theoretically I would upgrade from viewer to user if payment occurs
    roles: {type: [String], required: true, default: ['viewer']}
});

const User = mongoose.model("User", userSchema);

module.exports = User;