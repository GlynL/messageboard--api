const express = require("express");
const threads = require("./threads");
const replies = require("./replies");
const boards = require("./boards");
const users = require("./users");
const Board = require("../models/Board");

module.exports = function(app) {
  // pass board param to request object -- params don't get passed through this
  app.param("board", async (req, res, next, name) => {
    try {
      const board = await Board.findOne({ name });
      req.board = board;
      next();
    } catch (err) {
      next(err);
    }
  });

  app.param("thread", (req, res, next, id) => {
    req.id = id;
    next();
  });

  app.use("/api/users", users);
  app.use("/api/boards", boards);
  app.use("/api/:board/threads", threads);
  app.use("/api/:board/:thread/replies", replies);
};
