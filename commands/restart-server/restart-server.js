const { validateAdmin, restartServer } = require("../../helpers/helpers");
const Gamedig = require("gamedig");

module.exports.restartServer = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await receivedMessage.channel.send(
      "Restartuje serwer, dam info kiedy wstanie poczekaj..."
    );

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

    restartServer();
    await client.user.setActivity(`Serwer restart.`, {
      type: "WATCHING"
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
