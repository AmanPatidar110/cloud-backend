const User = require("../model/user");

exports.checkUser = async (firebaseUser) => {
  try {
    let savedUser = await User.findOne({ firebaseUserId: firebaseUser.uid });

    console.log("firebaseUser", firebaseUser);
    if (!savedUser) {
      console.log(`User with firebase ID ${firebaseUser.uid} does not exist`);
      savedUser = await addUser(firebaseUser);
      console.log("New User saved successfully");
    }
    return { ...savedUser.toObject() };
  } catch (error) {
    throw error;
  }
};

const addUser = async (userData) => {
  const newUser = new User({
    name: userData?.name,
    email: userData?.email,
    firebaseUserId: userData?.uid,
  });

  const user = await newUser.save();
  return user;
};
