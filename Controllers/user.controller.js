const checkUser = (firebaseUser) => {
  if (!firebaseUser) {
    throw new Error("User not found");
  }

  // if exists in DB, return user
  // else create user() in DB

  return firebaseUser;
};

const addUser = async (user) => {
  // add user to DB
  // return user;
};

module.exports = { createService };
