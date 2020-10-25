const { validateAdmin } = require("../../helpers/helpers");
const Gamedig = require("gamedig");

module.exports.restartServer = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`#restartserver`);
    await receivedMessage.channel.send(
      "Restartuje serwer, dam info kiedy wstanie poczekaj..."
    );

    setTimeout(() => {
      Gamedig.query({
        type: "arma3",
        host: "137.74.4.131",
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
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
