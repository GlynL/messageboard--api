const jwt = require("jsonwebtoken");

exports.getThreads = async function(req, res, next) {
  const board = req.board;
  // check valid board name
  if (!board) return res.status(422).json({ error: "Board doesn't exist." });
  const threads = board.threads;
  // respond with board and threads
  res.json({ board, threads });
};

exports.createThread = async function(req, res, next) {
  // grab board and token from request
  const board = req.board;
  const token = req.headers.authorization;
  console.log(board);
  // check valid board
  if (!board) return res.status(422).json({ error: "Invalid board name." });
  try {
    // get user id from token
    const { data } = jwt.verify(token, process.env.SECRET);
    // get info from request body
    const thread = req.body;
    // add current user onto model
    thread.user = data;
    // add new thread to subdoc
    board.threads.push(thread);
    // save model
    await board.save();
    return res.json(board);
  } catch (err) {
    next(err);
  }
};

exports.deleteThread = async function(req, res, next) {
  // get board and token from req
  const board = req.board;
  const token = req.headers.authorization;
  if (!board) return res.status(422).json({ error: "Invalid board name." });
  try {
    // get user id from token
    const { data } = jwt.verify(token, process.env.SECRET);
    // lookup thread from id passed in params
    const threadId = req.params.id;
    const thread = board.threads.id(threadId);
    // check that the thread was created by current user, if not, return error
    if (thread.user.toString() !== data)
      return res.json({ error: "Not authorized." });
    // remove thread from board
    board.threads.pull(threadId);
    // save model
    await board.save();
    return res.send("Thread successfully deleted.");
  } catch (err) {
    next(err);
  }
};
