// this relates to getting the JWT_SECRET key
require('dotenv').config(); 

const express = require("express");
// import "path" for the pdf creation
const path = require('path');
const routes = require("./routes");
const { router: authRouter } = require('./routes/auth');
const artworksRouter = require('./routes/artworks');
const pdfRouter = require('./routes/pdf');

const server = express();

// required middleware
server.use(express.json());

// Serve the static html file
server.use(express.static(path.join(__dirname, '..client/dist')));

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..client/dist/index.html'));
});

// mount the router
server.use('/', authRouter);
server.use('/artworks', artworksRouter);
server.use('/pdf', pdfRouter);
server.use(routes);

module.exports = server;
