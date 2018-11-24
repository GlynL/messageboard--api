const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.pre("save", function(next) {
  const user = this;

  // only hash password if new or modified
  if (!user.isModified("password")) return next();

  // gen salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    // hash (encrypt) password with salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      // overwrite plain passwrod with hashed
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
