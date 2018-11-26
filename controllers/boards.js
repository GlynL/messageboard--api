const Board = require("../models/Board");

exports.getBoards = async function(req, res, next) {
  try {
    // find all books
    const boards = await Board.find({});
    return res.json(boards);
  } catch (err) {
    next(err);
  }
};

// create a new board
exports.newBoard = async function(req, res, next) {
  const name = req.body.name;
  // ensure board naem is provided
  if (!name)
    return res.status(422).json({ error: "You must provide a board name" });
  try {
    // check board name is new
    const isDuplicate = await Board.findOne({ name });
    if (isDuplicate)
      return res
        .status(422)
        .json({ error: "Board with this name already exists." });

    // create new board model
    const newBoard = new Board({ name });
    const board = await newBoard.save();
  } catch (err) {
    return next(err);
  }
  res.send("Board created successfully");
};

// for testing
exports.removeBoard = async function(req, res, next) {
  const { name, key } = req.query;
  if (key !== "secret") return res.status(401).json({ error: "unauthorized" });
  try {
    await Board.findOneAndDelete({ name });
    return res.send("successfully removed");
  } catch (err) {
    next(err);
  }
};
