const express = require("express");
const LogoutRouter = express.Router();
LogoutRouter.post("/", (req, res) => {
  res.clearCookie("UserToken");
  res.status(200).json({ message: "Logged out successfully" });
});
module.exports = LogoutRouter;
