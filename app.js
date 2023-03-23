const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const projectRoutes = require("./Routes/project.routes.js");
const app = express();
const port = process.env.PORT || 9999;

app.use(express.json());

app.use(cors());

app.use("/project", projectRoutes);

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
