const express = require('express');
const PDFDocument = require('pdfkit');
// file store is for viewing and changing the file system on the server
const fs = require('fs');
const path = require('path');

const router = express.Router();
const { authMiddleware } = require('./auth');
const artworkDAO = require('../daos/artworks');

const pdfDir = path.join(__dirname, '..', 'samplePdfs');

// Use the filestore library to determine if the folder exists
// and if not, then make the folder
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}

router.get('/generate-pdf', authMiddleware, async (req, res) => {
    // tie the .pdf creation into my database
    try {
        // get the current user's ID from the decoded JWT
        const userId = req.user._id;

        // check to make sure there's a current user
        if (!userId) {
            return res.status(404).json({ error: 'No token provided. Are you signed in?' })
        }

        // get the artworks that belong to the current user
        const userArtworks = await artworkDAO.getArtworksByUserId(userId);

        if (!userArtworks || userArtworks.length === 0) {
            return res.status(404).json({ error: 'No artworks found for this user:', userId })
        }

        // handle the file naming
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `artworks_${timestamp}.pdf`;
        const filePath = path.join(pdfDir, filename);

        // create the pdf
        const doc = new PDFDocument();
        // create a funnel or place where the pdf can be created incrementally
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // put stuff in the pdf
        doc.fontSize(20).text(`Here are ${req.user.email}'s artworks`);
        doc.moveDown();

        // include a sample image for the time being
        const imagePath = path.join(__dirname, '..', 'sampleImages', 'Dec022023Photoshoot-017.jpg');

        // for each artwork include the title and the medium, and perhaps more later
        userArtworks.forEach((art, index) => {
            // set the max size for the image
            const imageSize = 100; 
            // get the current horizontal position of the cursor
            const imageX = doc.x;
            // get the current vertical position of the cursor
            const imageY = doc.y;

            // draw the image
            doc.image(imagePath, {
                width: imageSize
            });
            
            // get and set the x position for the text
            // + 10 (for example) is the padding
            const textX = imageX + imageSize + 12;
            const textY = imageY;

            // Save current y in order to set the next row's starting point
            const startY = doc.y;

            // put text to the right of the image
            doc
                .fontSize(14)
                .text(`${index + 1}. Title: ${art.title || 'No title provided'}`, textX, textY,{
                    width: 400,
                    continued: false
                });
            doc.text(`Medium: ${art.medium || '—'}`, textX);

            doc.moveDown();

            // do some calculations for placing the next row of content
            const imageHeight = imageSize;
            const textHeight = doc.y - startY;
            // take whichever is higher, the image height or the height of the text
            const rowHeight = Math.max(imageHeight, textHeight);

            doc.y = startY + rowHeight + 12;

            // reset the x position to the left margin
            doc.x = doc.page.margins.left;
        })

        doc.end();

        // send the file to the folder after it is created
        writeStream.on('finish', () => {
            res.download(filePath, filename);
        });

    } catch (error) {
        console.error(`There was a problem generating the pdf:`, error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

module.exports = router;
