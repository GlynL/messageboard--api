const express = require("express");
const router = express.Router();
const { getReplies, addReply, deleteReply } = require("../controllers/replies");
const { requireAuth } = require("../services/passport");

// /api/:board/:thread/replies
router.get("/", getReplies);
router.post("/", requireAuth, addReply);
router.delete("/:id", requireAuth, deleteReply);

module.exports = router;
