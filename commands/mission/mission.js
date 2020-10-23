const progress = require("progress-string");
const ftp = require("basic-ftp");
const fs = require("fs");
const axios = require("axios");
const { validatePermissions } = require("../../helpers/helpers");

module.exports.sendMission = async function(receivedMessage) {
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

    response.data.pipe(fs.createWriteStream(`./${fileName}`));
    let loading = await receivedMessage.channel.send(`Sending file...`);
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: process.env.FTP_IP,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        secure: false
      });

      await client.cd("137.74.4.131_2302/mpmissions");
      client.trackProgress(async info => {
        const msg = await receivedMessage.channel.messages.fetch({
          around: loading.id,
          limit: 1
        });
        const fetchedMsg = msg.first();
        await fetchedMsg.edit(
          `${bar(info.bytesOverall)} (${info.bytesOverall}/${total}) bytes`
        );
      });

      await client.uploadFrom(`./${fileName}`, `${fileName}`);
      client.trackProgress();
    } catch (err) {
      console.log(err);
    }
    client.close();

    await fs.unlink(`./${fileName}`, async err => {
      if (err) {
        console.error(err);
        await receivedMessage.channel.send(
          `Coś się wyjebało, daj info ProPankowi`
        );
        return;
      }
      console.log("html file removed!");
      await receivedMessage.channel.send(
        `Jest w pytke. Misyja jest już na serwie!`
      );
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
