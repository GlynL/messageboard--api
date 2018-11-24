const express = require("express");
const router = express.Router();
const {
  getThreads,
  createThread,
  deleteThread
} = require("../controllers/threads");
const { requireAuth } = require("../services/passport");

router.get("/", getThreads);
router.post("/", requireAuth, createThread);
router.delete("/:id", requireAuth, deleteThread);

// get all threads
// create thread
// delete thread

module.exports = router;
