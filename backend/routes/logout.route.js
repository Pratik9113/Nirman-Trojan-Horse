import express from "express";
const LogoutRouter = express.Router();
LogoutRouter.post("/", (req, res) => {
  res.clearCookie("UserToken");
  res.status(200).json({ message: "Logged out successfully" });
});
export default LogoutRouter;
