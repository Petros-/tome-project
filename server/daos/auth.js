// for defining the functions that CRUD users
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// create a new user
async function createUser ({email, passwordHash, roles = ['viewer']}) {
    // check to see if the email already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        console.error(`Somebody's already using that email. Maybe it's you?`);
        return null;
    } else {
        // use the create method (from Mongoose) to create a user
        const user = await User.create({email, password: passwordHash, roles});
        return user;
    }
}

// login
async function login (email, plainPassword) {
    const user = await User.findOne({email})
    if (!user) {
        console.error(`Didn't work. Have you signed up yet?`);
        return undefined;
    }

    // compare passwords
    const hasValidPassword = await bcrypt.compare(plainPassword, user.password);
    return hasValidPassword ? user : undefined;
}

// let a user change or update their password
async function changePswd (email, passwordHash) {
    // find a user that has the email provided
    const user = await User.findOne({email});

    // return an error if the user doesn't exist
    if (!user) {
        return undefined;
    }

    const newPassword = await User.changeUserPassword(email, passwordHash);
    return newPassword;
}

// get a specific user by their provided email
async function getUserByEmail(email) {
    return await User.findOne({email});
}

// get a specific user by their id
async function getUserById(id) {
    return await User.findById(id);
}

// is this function redundant? If so, which works?
// this one or the earlier one?
// I know this one gets used
async function updateUserPassword(userId, newPasswordHash) {
    return await User.findByIdAndUpdate(userId, {password: newPasswordHash});
}

// export all the functions for use in the routes file
module.exports = {
    createUser,
    login,
    changePswd,
    getUserByEmail,
    getUserById,
    updateUserPassword
}
