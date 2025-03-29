const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")


const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Not authorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  req.user = user; // Attach user to the request object
  next()
};

module.exports = protect