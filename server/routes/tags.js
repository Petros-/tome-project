const { Router } = require("express");
const router = Router();

const tagDAO = require('../daos/tags');
const { authMiddleware } = require('./auth');

// create a new tag
router.post("/tags", (req, res, next) => {

});

// get all the tags
router.get("/tags", (req, res, next) => {

});

// edit a tag
router.put("/tag/:id", (req, res, next) => {

});

// delete a tag
router.delete("/tag/:id", (req, res, next) => {

});

// view all artworks for a tag
router.get("/tag/:id", (req, res, next) => {

});