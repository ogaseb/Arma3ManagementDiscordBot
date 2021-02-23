const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const { validatePermissions } = require("../../helpers/helpers");
const { spawn } = require("child_process");
const { da } = require("date-fns/locale");

module.exports.parseModList = async function(receivedMessage) {
  if (validatePermissions(receivedMessage)) {
    if (!receivedMessage.attachments.size) {
      return await receivedMessage.channel.send(`Nie zapomnij wrzucić pliku!`);
    }
    const toGetFileName = receivedMessage.attachments.first().url.split("/");
    const lastForExtension = toGetFileName[toGetFileName.length - 1].split(".");
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
    const modString = '-mod="' + modsIdArray.join(";") + ';"';
    const modStringEx = modsIdArray.join(";") + ";";

    const result = modNamesString + "\n\n" + modString + "\n\n" + modStringEx;

    console.log(result);

    modsIdArray.forEach(modId => {
      const child = spawn("./a3upddownmod.sh");

      // process.stdin.pipe(child.stdin)

      child.stdout.on("data", data => {
        console.log(`${data}\n`);

        const searchInData = data.search("Fixed upper case for MOD");

        if (searchInData !== -1) {
          console.log(`its kinda working?`);
        }
      });

      child.on("close", code => {
        console.log(`child process exited with code ${code}`);
      });

      setTimeout(() => {
        child.stdin.write("d\n");
        child.stdin.write(`${modId}\n`);
      }, 1000);
    });

    fs.writeFile(
      `./greatest_sacred_automated_mod_list_file_for_${fileName}.txt`,
      result,
      async function(err) {
        if (err) {
          return console.log(err);
        }
        await receivedMessage.channel.send(" ", {
          files: [
            `./greatest_sacred_automated_mod_list_file_for_${fileName}.txt`
          ]
        });

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
};
