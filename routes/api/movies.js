const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");
const Movies = require("../../models/Movies");
const User = require("../../models/User");

const upload = multer();

// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, cb) => {
//     console.log("file", file);
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// });

//@GET ALL MOVIES
router.get("/", auth, async (req, res) => {
  try {
    const movies = await Movies.find();
    if (movies.length == 0) {
      return res.json({ msg: "No movies bro sorry" });
    }

    res.json(movies);
  } catch (error) {
    console.log({ msg: error.message });
  }
});

//@GET MOVIE BY ID
router.get("/:id", auth, async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      return res.json({ msg: "Sorry Wrong ID or movie is not there" });
    }
    res.json(movie);
  } catch (error) {}
});

//@POST CREATE A MOVIE
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const {
    mName,
    mDescription,
    mTrailer,
    mLinks,
    mType,
    category,
    rating,
  } = req.body;
  const movieFields = {};
  try {
    if (mName) movieFields.mName = mName;
    if (mDescription) movieFields.mDescription = mDescription;
    if (mTrailer) movieFields.mTrailer = mTrailer;
    if (mLinks) movieFields.mLinks = mLinks;
    if (category) movieFields.category = category;
    if (rating) movieFields.rating = rating;
    if (mType) movieFields.mType = mType;

    movieFields.mImage = req.file.buffer;
    movieFields.mImage.contentType = req.file.mimetype;

    let movieData = new Movies(movieFields);
    await movieData.save();
    res.json(movieData);
  } catch (error) {
    console.log(error.message);
  }
});

//@PUT update a movie
router.put("/:id", upload.single("image"), async (req, res) => {
  const {
    mName,
    mDescription,
    mTrailer,
    mLinks,
    mType,
    category,
    rating,
  } = req.body;
  const movieFields = {};
  try {
    if (mName) movieFields.mName = mName;
    if (mDescription) movieFields.mDescription = mDescription;
    if (mTrailer) movieFields.mTrailer = mTrailer;
    if (mLinks) movieFields.mLinks = mLinks;
    if (category) movieFields.category = category;
    if (rating) movieFields.rating = rating;
    if (mType) movieFields.mType = mType;

    movieFields.mImage = req.file.buffer;
    movieFields.mImage.contentType = req.file.mimetype;

    console.log("MOVIE IMAGE", movieFields.mImagey);
    let movieData = await Movies.findOne({ _id: req.params.id });
    if (movieData) {
      movieData = await Movies.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: movieFields,
        },
        {
          new: true,
        }
      );
      return res.json(movieData);
    }
    res.json({ msg: "NO MOvie Found" });
  } catch (error) {
    console.log(error.message);
  }
});

//@DELETE A Movie
router.delete("/:id", auth, async (req, res) => {
  try {
    await Movies.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Movie Deleted!" });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
