require("dotenv").config();
const cheerio = require("cheerio");
const fs = require("fs");
const { Client } = require("discord.js");
const { regexes } = require("./helpers/helpers");
const axios = require("axios");
const ftp = require("basic-ftp");
const progress = require("progress-string");
const cron = require("node-cron");
const { validatePermissions } = require("./helpers/helpers");

const client = new Client();

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

client.on("ready", async () => {
  console.log("On Discord!");
  console.log("Connected as " + client.user.tag);
  console.log("Servers:");
  client.guilds.forEach(guild => {
    console.log(" - " + guild.id);
    guild.channels.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });

  const statusArray = [
    { status: "DRAGO GEJMING", type: "GAMING" },
    { status: "MALPY GRAJO", type: "STREAMING" },
    { status: "ES", type: "WATCHING" }
  ];

  setInterval(async () => {
    const randomNumber = Math.floor(Math.random() * statusArray.length);
    await client.user.setActivity(statusArray[randomNumber].status, {
      type: statusArray[randomNumber].type
    });
  }, 5000 * 60);

  cron.schedule(
    "30 17 * * 2,4",
    async () => {
      await client.channels
        .get("753735965142417420")
        .send(
          `<@753999685437489234> misja za pół godziny! Zbierać się powoli!`
        );
    },
    {}
  );
});

client.on("message", receivedMessage => {
  if (receivedMessage.author === client.user) {
    return;
  }

  if (receivedMessage.content.startsWith(`$`)) {
    return processCommand(receivedMessage);
  }
});

const processCommand = async receivedMessage => {
  let fullCommand, primaryCommand;

  fullCommand = receivedMessage.content.substr(1);
  if (!fullCommand) {
    receivedMessage.channel.send(`???`);
  }

  const messageArguments = fullCommand.match(regexes.ARGUMENTS);

  if (messageArguments !== null && messageArguments.length) {
    primaryCommand = messageArguments[0]; // The first word directly after the exclamation is the command
    messageArguments.splice(0, 1);
  }

  if (primaryCommand === "parse") {
    if (validatePermissions(receivedMessage)) {
      const toGetFileName = receivedMessage.attachments.first().url.split("/");
      const lastForExtension = toGetFileName[toGetFileName.length - 1].split(
        "."
      );
      const extension = lastForExtension[lastForExtension.length - 1];

      if (extension !== "html") {
        return receivedMessage.channel.send(
          `Myślisz ze jesteś cwany? Preset wrzucaj a nie swoje nudesy xD`
        );
      }

      const fileName = toGetFileName[toGetFileName.length - 1];
      const file = await axios.get(receivedMessage.attachments.first().url);

      const parsed = cheerio.parseHTML(file.data.toString());
      const $ = cheerio.load(parsed);
      const modsIdArray = [];
      const modsNamesArray = [];

      $("[data-type=ModContainer]").map((i, element) => {
        modsIdArray.push(
          `@${
            $(element)
              .find("td:nth-of-type(3)")
              .text()
              .trim()
              .split("=")[1]
          }`
        );
        modsNamesArray.push(
          `@${
            $(element)
              .find("td:nth-of-type(3)")
              .text()
              .trim()
              .split("=")[1]
          } - ${$(element)
            .find("td:nth-of-type(1)")
            .text()
            .trim()}`
        );
      });
      const modNamesString = modsNamesArray.join("\n");
      const modString = '-mod="' + modsIdArray.join(";") + '"';
      const modStringEx = modsIdArray.join(";");

      const result = modNamesString + "\n\n" + modString + "\n\n" + modStringEx;

      console.log(result);

      fs.writeFile(
        `./greatest_sacred_automated_mod_list_file_for_${fileName}.txt`,
        result,
        async function(err) {
          if (err) {
            return console.log(err);
          }
          await receivedMessage.channel.send(
            "Here's your file sensei~~ :ayaya: ",
            {
              files: [
                `./greatest_sacred_automated_mod_list_file_for_${fileName}.txt`
              ]
            }
          );

          await fs.unlink(
            `./greatest_sacred_automated_mod_list_file_for_${fileName}.txt`,
            err => {
              if (err) {
                console.error(err);
                return;
              }
              console.log("html file removed!");

              //file removed
            }
          );
        }
      );
    } else {
      await receivedMessage.channel.send(
        `Nie masz uprawnień do korzystania z tego!`
      );
    }
  }

  if (primaryCommand === "mission") {
    if (validatePermissions(receivedMessage)) {
      const toGetFileName = receivedMessage.attachments.first().url.split("/");
      const lastForExtension = toGetFileName[toGetFileName.length - 1].split(
        "."
      );
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
          await receivedMessage.channel.messages
            .get(loading.id)
            .edit(
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
  }
};
