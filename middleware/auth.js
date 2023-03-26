const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'You must be logged in.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(authorization);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
