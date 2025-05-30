const { Router } = require("express");
const router = Router();

const tagDAO = require('../daos/tags');
const { authMiddleware } = require('./auth');

// create a new tag
router.post("/", authMiddleware, async (req, res, next) => {

});

// get all the tags
router.get("/", authMiddleware, async (req, res, next) => {
    const tags = await tagDAO.getTagsByUserId(req.user._id);
    res.json(tags);
});

// // edit a tag
// router.put("/tag/:id", authMiddleware, async (req, res, next) => {

// });

// // delete a tag
// router.delete("/tag/:id", authMiddleware, async (req, res, next) => {

// });

// // view all artworks for a tag
// router.get("/tag/:id", authMiddleware, async (req, res, next) => {

// });

module.exports = router;