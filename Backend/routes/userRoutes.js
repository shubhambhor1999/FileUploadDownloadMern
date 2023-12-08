const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controller/userController");
const authMiddleware = require("../middlewares/userMiddleware");

const router = express.Router();
//routes
//Register
router.post("/register", registerController);
//Login
router.post("/login", loginController);
//GET CURRENT USER
router.get("/current-user", authMiddleware, currentUserController);
module.exports = router;
