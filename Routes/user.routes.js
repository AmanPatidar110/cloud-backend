const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.get("/protected", authMiddleware, (req, res) => {
  return res.json({ message: "You have accessed the protected route." });
});

module.exports = router;
