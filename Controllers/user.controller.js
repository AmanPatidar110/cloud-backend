const User = require('../model/user')

const checkUser = (firebaseUser) => {
  
  User.findOne({ firebaseuserId: firebaseUser.uid }, (err, user) => {
  if (err) {
    console.error(err);
    mongoose.disconnect();
    return;
  }

  if (!user) {
    console.log(`User with ID ${userId} does not exist`);
    const newuser = new User({
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      firebaseuserId: firebaseUser.uid
    });
    
    newuser.save()
      .then(() => console.log('New User saved successfully'))
      .catch((err) => console.error('Error saving new user', error));
    
  } else {
    console.log(`User with ID ${userId} exists:`, user);
  }

  mongoose.disconnect();
});


  // if exists in DB, return user
  // else create user() in DB

  return firebaseUser;
};

const addUser = async (user) => {
  // add user to DB
  // return user;
};

module.exports = { createService };
