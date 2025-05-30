// for defining the functions that will access the database of tags

const mongoose = require('mongoose');

const Tag = require('../models/tags');

// create a tag
module.exports.createTag = async () => {
    if (!userId || !tagObject) {
        throw new Error("missing some key details like the tag text or the userId of the person posting this")
    }
    tagObject.createdBy = userId;
    tagObject.userId = userId;
    const createdTag = await Tag.create({ ...artObject, userId });
    return createdTag;
};

// get all the tags
module.exports.getTagsByUserId = async (userId) => {
    const tags = await Tag.find();
    return tags;
};