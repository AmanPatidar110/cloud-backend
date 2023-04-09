const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const projectRoutes = require("./Routes/project.routes.js");
const admin = require('firebase-admin');
const userRoutes = require('./routes/user');
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 9999;
const Dummy = require('./model/dummy');
const User = require('./model/user');
const File = require('./model/file');
const Project = require('./model/project');


app.use(express.json());

app.use(cors());

app.use("/project", projectRoutes);

app.get("/", (req, res) => {});



mongoose.connect('mongodb+srv://dwivedipankaj074:2N5lXmkk7ewBv95W@cloudproject.ofa5z5g.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});


const firebaseConfig = {
  // your firebase config here
  "type": "service_account",
  "project_id": "in-house-cloud",
  "private_key_id": "2c79ae6a47b386f40bb808e43894ca62d92d631c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDcYCl5vbs0YSc0\n4fEYF2PBsGihTpu+4RGvY4mN47X4M1gFqRs1AKu6NhTVrIKU0EpZYzPpx+zDgI1d\nrYG1NepVN11wNBiowkRBkTLvRJogepxwPjn18Wehq8C58biKT8H1HgT21DjAoXIv\n5BK6WGXvtU0+T2F2581oxWnKw4d1aQ593N9G9sNesZjMGD5SbQ5rgLTXTRGDNHyN\ngD3UKAZCB+R48dn9ahhuq4sD0O/axJw2ClYCQHkkhbQCGiIxyhyokduAzuHack4u\nBl9PD+VZKqr1RwFOAsmJ7Nr7yj9lVEfunS9XUhrvwCDjOL4M6MSIL+g87inC9G/P\nXD4Q4nEjAgMBAAECggEALPOQgjypSu3mSWss+nUK7B9HuF+IdU8DhHsRO9gO7inK\n8pyj6BPS85DEfzFJEYHLKKCLnkwhh19ZdppFsujke61nadO2k/XMZnNvqE6eAbIA\n5wRKXlh3gwq9rTAZLF1Ieu88o/x19xT3bb1f9JLDeDnLH8KhZtexloVuJuXrY49B\ncBqHZCSFcLNR0zV8dc3t7XeirCJm7MUy/mC6UTBV5ZoOn728gg1h1WGzXeIC6C87\nC39YCJlJ/Qk/lNjM+C1+VoPGI2nCzZkqXIWWx6hQhZrQOU5STpQbiZ+mgiNj/nKN\n1D8wVXNFjynAaUaQakeCv45KvhZEUjiMF492Sa8OQQKBgQDzWZdzNmQko3Wi94Iw\nFT0tr/Jd5Yw5z8uTtG7ioZ+JIU5c3BZ53m/IJnPn2nhSzMy177RwvspdLesVHbUN\nuiD6rkEyY4IOHM+xFiAk8aDie1igXxS47suCrEfIp/sutJXfGRmmRYbSHeqy3Nyz\nhGiNG5l65TJcHL4sh6IT0nT4NQKBgQDn1NY1Fz0aaxhefs5wr0bJYYUlFOR64F9D\nKxzVQy5sd+W5XmucLhvKVLZSIDRKIWJQFbmP7mi7LAJnKcmy2/XqSfCDmHnnDnMf\nNLPC659EK5VDCgt0GAHsD4cKog78br3eNaDcyDAvzRj/99MzHZFHYAFRYEsnaoX1\nwhE5isXe9wKBgQCvNLT/BY0qd+nNcKhyGAiZKVG12vyP7xUifklLsJQddjZmUyt3\niPgwQcc3iisRalSFNVVTy3oFhnb4GBBwFq+B7Q4RymUr5gB+/nAcST/NcINJy8su\nrvclWQbB6HfHk8tH+llmRi6gf1uoda4NLerclZ92RShx+1vM0caWwPLodQKBgD7C\nwdLRnbsfLxO15JFhAhrWicMGKuyQ/XkjnMSnUVQQCWLritpXKTLXSBxnl4BSFVl0\n6C1s73FscqIXEAGZxrNMnQ4jIy1IHiZekCO+wfkki14AxCUDstGDSp24TbJNEJ2t\niwT6NQFb1t7E6qo14PSfqvuqw+3Bys5DYYJgbTz1AoGBAN06X3H2pAoS8pkSIRyo\nX71jJO0VMbnd04qTSno8nuvmqJKdQ6AyYHfdhD6J0oNVcLNiKZyhcmExGe6uaxm/\nTpMzLkt0sP3x3kArvDs0lH9BldL87JLd/Ght/M8MMi6RjOxgAOvUrRr1zKQZZA3J\nJnNo6BITHFPdG5pEcHdeANWa\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-j3ayy@in-house-cloud.iam.gserviceaccount.com",
  "client_id": "118035475379933079858",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j3ayy%40in-house-cloud.iam.gserviceaccount.com"
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://in-house-cloud.firebaseio.com",
});






// Routes
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//mongowork


const projectdummy = new Project({
  projectname: 'Backend Server',
  userId: 'aksmsdkmfkmsadkf',
  status: 'Running'
});

projectdummy.save()
  .then(() => console.log('Dummy saved successfully'))
  .catch((err) => console.error('Error saving dummy', err));