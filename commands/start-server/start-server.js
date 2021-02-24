const {
  validateAdmin,
  startServer,
  checkIfServerIsOn
} = require("../../helpers/helpers");
const Gamedig = require("gamedig");

module.exports.startServer = async function(receivedMessage) {
  if (validateAdmin(receivedMessage)) {
    if (checkIfServerIsOn()) {
      return receivedMessage.channel.send("Server już jest uruchomiony");
    }

    await receivedMessage.channel.send("Uruchamiam server...");

    setTimeout(() => {
      Gamedig.query({
        type: "arma3",
        host: "127.0.0.1",
        maxAttempts: 1000
      })
        .then(async state => {
          await receivedMessage.channel.send("Serwer powinien już działać!");
        })
        .catch(async error => {
          await receivedMessage.channel.send(
            "Jednak coś się zwaliło i nie wstał..."
          );
        });
    }, 5000);

    startServer();
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
