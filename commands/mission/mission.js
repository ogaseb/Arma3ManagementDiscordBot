const progress = require("progress-string");
const fs = require("fs");
const axios = require("axios");
const {
  validatePermissions,
  stopServer,
  checkIfServerIsOn
} = require("../../helpers/helpers");

module.exports.sendMission = async function(receivedMessage, client) {
  if (validatePermissions(receivedMessage)) {
    if (!receivedMessage.attachments.size) {
      return await receivedMessage.channel.send(`Nie zapomnij wrzucić pliku!`);
    }

    const toGetFileName = receivedMessage.attachments.first().url.split("/");
    const lastForExtension = toGetFileName[toGetFileName.length - 1].split(".");
    const extension = lastForExtension[lastForExtension.length - 1];

    if (extension !== "pbo") {
      return receivedMessage.channel.send(
        `Myślisz ze jesteś cwany? Misje wrzucaj a nie swoje nudesy xD`
      );
    }
    let loading = await receivedMessage.channel.send(`Saving file...`);
    stopServer();

    const interval = setInterval(async () => {
      if (!checkIfServerIsOn()) {
        clearInterval(interval);
        await client.user.setActivity(`Serwer jest wyłączony.`, {
          type: "WATCHING"
        });

        const fileName = toGetFileName[toGetFileName.length - 1];
        const response = await axios({
          method: "get",
          url: receivedMessage.attachments.first().url,
          responseType: "stream"
        });

        const total = response.headers["content-length"];
        let bar = progress({
          width: 50,
          total: parseInt(total),
          style: function(complete, incomplete) {
            return "[" + complete + ">" + incomplete + "]";
          }
        });
        const missionFile = fs.createWriteStream(
          `/home/propanek/Steam/arma3/mpmissions/${fileName}`
        );
        response.data.pipe(missionFile);

        missionFile.on("finish", async function() {
          console.log(
            "file downloaded to ",
            `/home/propanek/Steam/arma3/mpmissions/${fileName}`
          );

          await receivedMessage.channel.send(
            `Jest w pytke. Misyja \`${fileName}\` jest już na serwie! Teraz możesz uruchomić serwer ponownie.`
          );
        });
      }
    }, 1000);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
