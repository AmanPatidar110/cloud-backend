const express = require("express");
const cors = require("cors");

const projectRoutes = require("./Routes/project.routes.js");
const admin = require("firebase-admin");
const { firebaseConfig } = require("./firebase-config.js");
const auth = require("./middleware/auth.js");

const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 9999;
const Dummy = require("./model/dummy");
const User = require("./model/user");
const File = require("./model/file");
const Project = require("./model/project");

app.use(express.json());

app.use(cors());

app.use("/project", projectRoutes);

app.get("/", (req, res) => {});

mongoose
  .connect(
    "mongodb+srv://dwivedipankaj074:2N5lXmkk7ewBv95W@cloudproject.ofa5z5g.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

app.use("/project", auth, projectRoutes);
// app.use("/user", userRoutes);

// Routes
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//mongowork

const projectdummy = new Project({
  projectname: "Backend Server",
  userId: "aksmsdkmfkmsadkf",
  status: "Running",
});

projectdummy
  .save()
  .then(() => console.log("Dummy saved successfully"))
  .catch((err) => console.error("Error saving dummy", err));
