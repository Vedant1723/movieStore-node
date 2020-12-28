const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  mName: {
    type: String,
  },
  mImage: {
    type: Buffer,
    contentType: String,
  },
  mType: {
    type: String,
  },
  mDescription: {
    type: String,
  },
  mTrailer: {
    type: String,
  },
  mLinks: {
    type: [String],
  },
  category: {
    type: String,
  },
  rating: {
    type: String,
  },
});

module.exports = Movie = mongoose.model("movies", MovieSchema);
