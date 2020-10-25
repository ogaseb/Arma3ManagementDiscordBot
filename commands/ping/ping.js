const Gamedig = require("gamedig");
const { MessageEmbed } = require("discord.js");

module.exports.pingServer = async function(receivedMessage) {
  Gamedig.query({
    type: "arma3",
    host: "137.74.4.131"
  })
    .then(async state => {
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Pong!")
        .setDescription("Aktualne info o serwerku")
        .setThumbnail(
          "https://media1.tenor.com/images/f1fed6c2dc8f0919c591e3e2bd225d09/tenor.gif?itemid=16437115"
        )
        .addField("IP", state.connect, true)
        .addField("Ping", state.ping, true)
        .addField("\u200b", "\u200b")
        .addField("Nazwa", state.name, true)
        .addField("Mapa", state.map, true)
        .addField("Moduł", state.raw.game, true)
        .addField("Liczba graczy", state.raw.numplayers, true)
        .addField("Max. liczba graczy", state.maxplayers, true)
        .addField("Wersja gry", state.raw.version, true)
        .setTimestamp();
      await receivedMessage.channel.send(embed);
    })
    .catch(async error => {
      await receivedMessage.channel.send(
        "Nie mogę pobrać info o serwerze, prawdopodobnie jest wyłaczony."
      );
    });
};
