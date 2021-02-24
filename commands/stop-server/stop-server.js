const { validateAdmin, stopServer } = require("../../helpers/helpers");

module.exports.stopServer = async function(receivedMessage) {
  if (validateAdmin(receivedMessage)) {
    await receivedMessage.channel.send("Wyłączam serwer...");

    stopServer();
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
