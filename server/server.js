// this relates to getting the JWT_SECRET key
require('dotenv').config();

const express = require("express");

// required middleware
const server = express();
server.use(express.json());

// import "path" for the pdf creation
const path = require('path');
const routes = require("./routes");
const { router: authRouter } = require('./routes/auth');
const artworksRouter = require('./routes/artworks');
const pdfRouter = require('./routes/pdf');


// mount the router
server.use('/', authRouter);
server.use('/artworks', artworksRouter);
server.use('/pdf', pdfRouter);
server.use(routes);

// Serve the static html file when not testing
if (process.env.NODE_ENV !== 'test') {
    server.use(express.static(path.join(__dirname, '../client/dist')));
    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}


module.exports = server;
