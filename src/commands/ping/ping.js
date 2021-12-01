import Gamedig from "gamedig";
import { MessageEmbed } from "discord.js";

export const pingServer = async function(receivedMessage) {
  Gamedig.query({
    type: "arma3",
    host: "127.0.0.1"
  })
    .then(async state => {
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Pong!")
        .setDescription("Aktualne info o serwerku")
        .setThumbnail(
          "https://image.winudf.com/v2/image/YWRueWV5LnNvdW5kLmF5YXlhX2ljb25fMF9lNTE3ODM5OA/icon.png"
        )
        .addField("IP", state.connect ? state.connect : "-", true)
        .addField("Ping", state.ping ? state.ping : "-", true)
        .addField("\u200b", "\u200b")
        .addField("Nazwa", state.name ? state.name : "-", true)
        .addField("Mapa", state.map ? state.map : "-", true)
        .addField("Moduł", state.raw.game ? state.raw.game : "-", true)
        .addField(
          "Liczba graczy",
          state.raw.numplayers ? state.raw.numplayers : "-",
          true
        )
        .addField(
          "Max. liczba graczy",
          state.maxplayers ? state.maxplayers : "-",
          true
        )
        .addField(
          "Wersja gry",
          state.raw.version ? state.raw.version : "-",
          true
        )
        .setTimestamp();
      await receivedMessage.channel.send(embed);
    })
    .catch(async error => {
      await receivedMessage.channel.send(
        `Nie mogę pobrać info o serwerze, prawdopodobnie jest wyłaczony. ${error}`
      );
    });
};
