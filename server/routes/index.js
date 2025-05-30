const { Router } = require("express");
const router = Router();

const {router: authRouter} = require("./auth");
const tagsRouter = require("./tags");
const artworksRouter = require("./artworks");
const pdfRouter = require("./pdf");

router.use('/auth', authRouter);
router.use('/tags', tagsRouter);
router.use('/artworks', artworksRouter);
router.use('/pdf', pdfRouter);

module.exports = router;
