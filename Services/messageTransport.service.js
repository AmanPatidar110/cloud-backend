const { realTimeDB } = require('../firebaseApp');

class MessageTransport {
  email = '';
  projectName = 'ProjectName';

  constructor({ projectName, email }) {
    this.email = email;
    this.projectName = projectName;
  }

  log = async (...args) => {
    const ref = realTimeDB.ref(this.projectName || 'unknownProjectName');

    args.forEach(async (message) => {
      console.log(`[${this.projectName || 'unknownProjectName'}]: `, message);

      ref.push({
        timeStamp: Date.now(),
        email: this.email,
        projectName: this.projectName,
        message: message || 'Did not receive any message',
      });
    });
  };
}

module.exports = { MessageTransport };
