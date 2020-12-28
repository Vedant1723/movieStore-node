const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@GET Route
//@DESC GET LOGGED IN ADMIN'S DETAILS
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      res.json(user);
    }
    res.json({ msg: "Please enter the correct credentials" });
  } catch (error) {
    console.log(error);
  }
});

//@POST ROUTE
//@DESC LOG IN ADMIN
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "User does not exists!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid Credentials!" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 36000000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.json({ msg: error.message });
  }
});

module.exports = router;
