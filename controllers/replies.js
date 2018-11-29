const jwt = require("jsonwebtoken");

exports.getReplies = async function(req, res, next) {
  const board = req.board;
  if (!board) return res.status(422).json({ error: "Invalid board name." });
  const threadId = req.id;
  // get all replies from thread
  const thread = board.threads.id(threadId);
  if (!thread) return res.status(422).json({ error: "Invalid thread." });
  const replies = thread.replies;
  res.json(replies);
};

exports.addReply = async function(req, res, next) {
  // grab info from request
  const token = req.headers.authorization;
  const board = req.board;
  const threadId = req.id;
  const reply = req.body;

  // check valid board
  if (!board) return res.status(422).json({ error: "Invalid board name." });

  try {
    // user id from token
    const { data } = jwt.verify(token, process.env.SECRET);
    // add user info to reply
    reply.user = data;
    // find thread
    const thread = board.threads.id(threadId);
    // check thread exists
    if (!thread) return res.status(422).json({ error: "Invalid thread." });
    // add reply to array of replies
    thread.replies.push(reply);
    // update model
    const updatedBoard = await board.save();
    res.json({ status: "Reply added successfully", thread });
  } catch (err) {
    next(err);
  }
};

exports.deleteReply = async function(req, res, next) {
  // grab info from req
  const token = req.headers.authorization;
  const board = req.board;
  const threadId = req.id;
  const replyId = req.params.id;
  // check valid board
  if (!board) return res.status(422).json({ error: "Invalid board name." });

  try {
    // lookup thread & check valid
    const thread = board.threads.id(threadId);
    if (!thread) return res.status(422).json({ error: "Invalid thread." });
    // lookup replies from thread
    const replies = thread.replies;
    // get specific reply from array & check valid
    const reply = replies.id(replyId);
    if (!reply) return res.status(422).json({ error: "Invalid reply." });
    // get user id from token
    const { data } = jwt.verify(token, process.env.SECRET);
    // check user created reply
    if (reply.user.toString() !== data)
      return res.json({ error: "Not authorized" });
    // remove reply from array
    replies.pull(replyId);
    // update model
    await board.save();
    return res.json("successfully deleted");
  } catch (err) {
    next(err);
  }
};
