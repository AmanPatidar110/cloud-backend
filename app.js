const express = require('express');
const cors = require('cors');

const projectRoutes = require('./Routes/project.routes.js');
const storageRoutes = require('./Routes/storage.routes.js');
const userRoutes = require('./Routes/user.routes.js');

const admin = require('firebase-admin');
const { firebaseConfig } = require('./firebase-config.js');
const { firebaseApp } = require('./firebaseApp.js');
const auth = require('./middleware/auth.js');

const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 9999;

firebaseApp;
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    'mongodb+srv://cloud:Sj2CYmOpGTvL7QZr@my-cluster.tlv8z.mongodb.net/in-house-cloud',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Routes
app.use('/project', auth, projectRoutes);
app.use('/user', auth, userRoutes);
app.use('/storage', auth, storageRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
