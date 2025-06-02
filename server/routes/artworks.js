// for the routes which CRUD the artworks database

require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const Multer = require("multer");
const multer = Multer({ storage: Multer.memoryStorage()});

const router = Router();
const { handleUpload } = require('../daos/artworks');
const artworkDAO = require('../daos/artworks');
const { authMiddleware } = require('./auth');

// multer middleware
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

// create a new artwork
router.post("/", authMiddleware, multer.single('image'), async (req, res, next) => {
    const userId = req.user._id;
    const roles = req.user.roles;

    try {
        if (!roles || !roles.includes('viewer')) {
            return res.status(403).json({ error: 'Only signed up users can add items' });
        } else {
            const artwork = await artworkDAO.createArtwork(userId, req.body);
            if (!artwork) {
                return res.status(404).send("could not make the artwork record")
            }

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI);
            artwork.image = cldRes.secure_url;
            await artwork.save();
            res.json(cldRes);

            return res.status(200).json(artwork);
        }

    } catch (e) {
        next(e);
    }
});

// get all artworks
router.get("/", authMiddleware, async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Auth token missing or problematic' });
    }

    const userId = req.user._id;
    const artworks = await artworkDAO.getArtworksByUserId(userId);
    return res.json(artworks);

});

// view a single artwork
router.get("/:id", authMiddleware, async (req, res, next) => {
    const roles = req.user.roles;

    try {
        // if there aren't any roles, or if the roles don't include
        // 'viewer' then return 403
        if (!roles || (!roles.includes('viewer'))) {
            return res.status(403).json({ error: `Only signed in users can see what's in here` })
        }
        const artwork = await artworkDAO.getArtworkById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ error: `artwork not found` });
        }

        return res.status(200).json(artwork);

    } catch (e) {
        next(e);
    }

});

// edit an artwork
// router.put("/:id", authMiddleware, async (req, res, next) => {

// });


// delete an artwork
// router.delete("/:id", authMiddleware, async (req, res, next) => {

// });

module.exports = router;