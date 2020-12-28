const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@GET Route
//@DESC GET LOGGED IN Clients'S DETAILS
router.get("/", auth, async (req, res) => {
  console.log("User", req.user.id);
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

//@POST ROUTE
//@DESC LOG IN CLIENT
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
