const express = require("express");
const router = express.Router();
const { requireAuth, requireSignin } = require("../services/passport");

const { signup, login } = require("../controllers/auth");

router.get("/", requireAuth, (req, res, next) => res.send("approved"));
router.post("/signup", signup);
router.post("/login", requireSignin, login);

module.exports = router;
