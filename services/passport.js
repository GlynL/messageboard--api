const passport = require("passport");
const User = require("../models/User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// local optiosn setup
const localOptions = { usernameField: "email" };

// create local strategy
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  // verify email and password
  User.findOne({ email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    // check password
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

// setup opotiosn for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.SECRET
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.data, function(err, user) {
    if (err) return done(err, false);
    if (user) return done(null, user);
    else done(null, false);
  });
});

// tell pasport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);

exports.requireAuth = passport.authenticate("jwt", { session: false });
exports.requireSignin = passport.authenticate("local", { session: false });
