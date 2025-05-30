// this relates to getting the JWT_SECRET key
require('dotenv').config();
const express = require("express");
const cors = require('cors');
// import "path" for the pdf creation
const path = require('path');
const { router: authRouter } = require('./routes/auth');
const routes = require("./routes");
const artworksRouter = require('./routes/artworks');
const pdfRouter = require('./routes/pdf');

// required middleware
const server = express();
server.use(express.json());

server.use(cors({
    // Frontend server
    origin: 'http://localhost:5173', 
    credentials: true
  }));

// mount the router
server.use('/', routes);
server.use('/auth', authRouter);
server.use('/artworks', artworksRouter);
server.use('/pdf', pdfRouter);


// Serve the static html file when not testing
if (process.env.NODE_ENV !== 'test') {
    server.use(express.static(path.join(__dirname, '../client/dist')));
    // server.get('*', (req, res) => {
    //     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    // });
}


module.exports = server;
