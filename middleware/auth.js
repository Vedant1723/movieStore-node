const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.json({ msg: "No token, Authorization Denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.json({ msg: "Token is not Valid" });
  }
};
