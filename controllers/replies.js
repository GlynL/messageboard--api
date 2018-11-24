const jwt = require("jsonwebtoken");

exports.getReplies = async function(req, res, next) {
  const board = req.board;
  const threadId = req.id;
  // get all replies from thread
  const replies = board.threads.id(threadId).replies;
  res.json(replies);
};

exports.addReply = async function(req, res, next) {
  // grab info from request
  const token = req.headers.authorization;
  const board = req.board;
  const threadId = req.id;
  const reply = req.body;
  try {
    // user id from token
    const { data } = jwt.verify(token, process.env.SECRET);
    // add user info to reply
    reply.user = data;
    // add reply to array of replies
    board.threads.id(threadId).replies.push(reply);
    // update model
    await board.save();
    res.send("Reply added successfully");
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
  try {
    // lookup replies from thread
    const replies = board.threads.id(threadId).replies;
    // get specific reply from array
    const reply = replies.id(replyId);
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
