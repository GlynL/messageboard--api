const jwt = require("jsonwebtoken");
const User = require("../models/User");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWJmNjZiMjcwOThmNTgxZjA4MDNkNGI0IiwiaWF0IjoxNTQyODc1OTQzfQ.0gDNmghHb2Pjhpn - 0wv_VllwqGLNOu7rBFQM6c_ySj8
function tokenForUser(user) {
  return jwt.sign({ data: user.id }, process.env.SECRET);
}

exports.signup = async function(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(422)
      .json({ error: "You must provide an email and password." });
  try {
    // check for existing user
    const existingUser = await User.findOne({ email });
    // return error if email already used
    if (existingUser)
      return res.status(422).json({ error: "Email already in use" });
    // create new user
    const newUser = new User({ email, password });
    const user = await newUser.save();
    // respond with token
    return res.json({ token: tokenForUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = function(req, res, next) {
  res.json({ token: tokenForUser(req.user) });
};
