const User = require('../model/user');
const { sendEmail } = require('../Services/email.service');
exports.checkUser = async (firebaseUser) => {
  try {
    let savedUser = await User.findOne({ firebaseUserId: firebaseUser.uid });

    console.log('firebaseUser', firebaseUser);
    if (!savedUser) {
      console.log(`User with firebase ID ${firebaseUser.uid} does not exist`);
      savedUser = await addUser(firebaseUser);
      const html_text =
        "<p>Dear User,</p><p>Thank you for registering with our cloud service! You now have access to 10 GB of cloud storage and 20 project hosting servers.</p><p>If you have any questions or issues, please don't hesitate to contact our support team.</p><p>Best regards,<br>The My Cloud Service Team</p>";
      const bodyy =
        'Congratulations! Your account has been successfully registered with the IIITDM Kurnool Local Cloud Service. As a user of the free tier account, you will be able to utilize 10 GB of cloud storage and have access to 20 servers for hosting your projects.\n\n\nBest regards \nThe My Cloud Service Team';
      await sendEmail(
        (to = firebaseUser.email),
        (subject = 'Welcome to My Cloud Service!'),
        (htmlbody = html_text),
        (body = bodyy)
      );
      console.log('New User saved successfully');
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
