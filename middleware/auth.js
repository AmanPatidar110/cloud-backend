const admin = require("firebase-admin");
const { checkUser } = require("../Services/user.service.js");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "You must be logged in." });
    }

    const user = await admin.auth().verifyIdToken(authorization);
    const savedUser = await checkUser(user);

    res.user = { ...savedUser };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token." });
  }
};
