const multer = require("multer");
const path = require("path");
const connectDB = require("./config/db");
const express = require("express");
const app = express();

connectDB();

app.use(require("cors")());

app.use(express.json({ extended: false }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//Routes
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/adminAuth", require("./routes/api/adminAuth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/movies", require("./routes/api/movies"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server connected on : ", PORT);
});
