const {
  validateAdmin,
  stopServer,
  checkIfServerIsOn
} = require("../../helpers/helpers");

module.exports.stopServer = async function(receivedMessage) {
  if (validateAdmin(receivedMessage)) {
    if (!checkIfServerIsOn()) {
      return receivedMessage.channel.send("Server jest już wyłączony");
    }

    await receivedMessage.channel.send("Wyłączam serwer...");

    stopServer();
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
