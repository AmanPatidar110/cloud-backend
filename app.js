const express = require("express");
const cors = require("cors");

const projectRoutes = require("./Routes/project.routes.js");
const admin = require("firebase-admin");
const { firebaseConfig } = require("./firebase-config.js");
const auth = require("./middleware/auth.js");

const app = express();
const port = process.env.PORT || 9999;

app.use(express.json());

app.use(cors());

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

app.use("/project", auth, projectRoutes);
// app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
