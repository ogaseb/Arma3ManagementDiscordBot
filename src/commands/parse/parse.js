import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";
import {
  validatePermissions,
  stopServer,
  checkIfServerIsOn
} from "../../helpers/helpers";
import { downloadMods } from "./download_mods";

export const parseModList = async function(receivedMessage, client) {
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
    const modsIdArrayWithAt = [];

    $("[data-type=ModContainer]").map((i, element) => {
      modsIdArray.push(
        `${
          $(element)
            .find("td:nth-of-type(3)")
            .text()
            .trim()
            .split("=")[1]
        }`
      );
      modsIdArrayWithAt.push(
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
    const modString = '-mod="' + modsIdArrayWithAt.join(";") + ';"';
    const modStringEx = modsIdArrayWithAt.join(";") + ";";
    const result = modNamesString + "\n\n" + modString + "\n\n" + modStringEx;

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
    stopServer();

    const interval = setInterval(async () => {
      if (!checkIfServerIsOn()) {
        clearInterval(interval);
        await client.user.setActivity(`Serwer jest wyłączony`, {
          type: "WATCHING"
        });
        console.log(downloadMods());
        return downloadMods(
          receivedMessage,
          modsIdArray,
          modsNamesArray,
          client
        );
      }
    }, 1000);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
