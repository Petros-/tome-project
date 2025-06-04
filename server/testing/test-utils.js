const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log("MONGO_URI is", process.env.MONGO_URI);
const mongoose = require("mongoose");
const models = [
    // add other models if you add them in ../models
  // require("./models/artwork"),
  require("../models/user"),
  require("../models/artwork")
];

module.exports = {};

module.exports.connectDB = async () => {
  const mongoUrl = process.env.MONGO_URI;
  if(!mongoUrl) throw new Error("Missing MONGO_URI in enviroment variables");
  await mongoose.connect(process.env.MONGO_URI, {});
  await Promise.all(models.map((m) => m.syncIndexes()));
};

module.exports.stopDB = async () => {
  try {
    console.log("Disconnecting from the database...");
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  } catch(error) {
    console.error("There was a problem with disconnecting from the database:", error);
    throw error;
  }
};

module.exports.clearDB = async () => {
  try{
    console.log("clearing the test database...");
    await Promise.all(models.map((model) => model.deleteMany({})));
    console.log("was able to clear the database");
  } catch (error) {
    console.error("There was a problem with clearing the database:", error);
    throw error;
  }
};

module.exports.findOne = async (model, query) => {
  const result = await model.findOne(query).lean();
  if (result) {
    result._id = result._id.toString();
  }
  return result;
};

module.exports.find = async (model, query) => {
  const results = await model.find(query).lean();
  results.forEach((result) => {
    result._id = result._id.toString();
  });
  return results;
};
