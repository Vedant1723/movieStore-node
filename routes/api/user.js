const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const Otp = require("../../models/Otp");
const nodemailer = require("nodemailer");
const mailer = require("../../Nodemailer");

//@POST ROUTE
//@DESC Create CLIENT
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with same email already Exists!" });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
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
    console.log(error);
    res.json({ msg: error.message });
  }
});

//@POST Send Email To the Server for OTP Mail
router.post("/sendOTP", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ msg: "User Does not Exist" });
    }
    var digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    let OTP = new Otp({
      userId: user._id,
      otp: otp,
    });
    OTP.save((err) => {
      if (err) {
        return res.json({ msg: err.message });
      }
      var transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 5000,
        auth: {
          user: "vedant.pruthi.io@gmail.com",
          pass: "System.in_1723",
        },
      });
      var mailOptions = {
        from: "Movie Store",
        to: req.body.email,
        subject: "OTP Verification Mail",
        text:
          "Hello " +
          user.name +
          " Here is the OTP " +
          otp +
          " and it is valid for 15 mins froom now!",
      };
      mailer(transport, mailOptions);
      res.json({ msg: "Email Sent!" });
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Confirm OTP
router.post("/confirmOTP", async (req, res) => {
  Otp.findOne({ otp: req.body.otp }, (err, otp) => {
    if (!otp) {
      return res.json({ msg: "OTP Not Valid" });
    }
    User.findOne({ _id: otp.userId }, (err, user) => {
      if (err) {
        return res.json({ msg: err.message });
      }
      if (otp.isUsed) {
        return res.json({ msg: "OTP is Already Used" });
      }
      otp.isUsed = true;
      otp.save((err) => {
        if (err) {
          return res.json({ msg: err.message });
        }
        res.json({ msg: "OTP Verified Successfully" });
      });
    });
  });
});

//@PUT Update Password
router.put("/updatePassword", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOneAndUpdate({ email }, { password: password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
});

//@GET LOGGED in user DETAILS
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
