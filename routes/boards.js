const express = require("express");
const router = express.Router();
const { getBoards, newBoard } = require("../controllers/boards");
const passportService = require("../services/passport");
const passport = require("passport");
const { requireAuth } = require("../services/passport");

router.get("/", getBoards);
router.post("/", requireAuth, newBoard);
module.exports = router;
