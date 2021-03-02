const fs = require("fs");
const { spawn } = require("child_process");
const progress = require("progress-string");
const { restartServer } = require("../../helpers/helpers");

module.exports.downloadMods = async function(
  receivedMessage,
  modsIdArray,
  modsNamesArray
) {
  let interval = 0;
  let loading = await receivedMessage.channel.send(
    `Downloading/Updating mods...`
  );

  let bar = progress({
    width: 50,
    total: parseInt(modsIdArray.length),
    style: function(complete, incomplete) {
      return "[" + complete + ">" + incomplete + "]";
    }
  });

  const download = async id => {
    const checkIfEnd = async () => {
      console.log(`${bar(interval + 1)} ${interval + 1}/${modsIdArray.length}`);
      const msg = await receivedMessage.channel.messages.fetch({
        around: loading.id,
        limit: 1
      });
      const fetchedMsg = msg.first();
      await fetchedMsg.edit(
        `${bar(interval + 1)} ${interval + 1}/${
          modsIdArray.length
        } mod found, updating - ${modsNamesArray[interval]}`
      );
      interval++;
      if (interval + 1 > modsIdArray.length) {
        interval = 0;
        const msg = await receivedMessage.channel.messages.fetch({
          around: loading.id,
          limit: 1
        });
        const fetchedMsg = msg.first();
        await fetchedMsg.edit(`Download completed, now starting the server`);

        const modLineID = modsIdArray.join(";") + ";";
        await fs.writeFile(`./ids.txt`, `IDS="${modLineID}"`, async function(
          err
        ) {
          if (err) {
            return console.log(err);
          }
        });
        restartServer();
        return client.user.setActivity(`Serwer jest uruchamiany.`, {
          type: "WATCHING"
        });
      } else {
        return download(modsIdArray[interval]);
      }
    };

    const child = spawn("./a3upddownmod.sh");

    try {
      await fs.promises.access(
        `/home/propanek/Steam/steamapps/workshop/content/107410/${id}`
      );
      const msg = await receivedMessage.channel.messages.fetch({
        around: loading.id,
        limit: 1
      });
      const fetchedMsg = msg.first();
      await fetchedMsg.edit(
        `${bar(interval + 1)} ${interval + 1}/${
          modsIdArray.length
        } mod found, updating - ${modsNamesArray[interval]}`
      );
      console.log(
        `${bar(interval + 1)} ${interval + 1}/${
          modsIdArray.length
        } mod found, updating - ${modsNamesArray[interval]}`
      );

      child.stdin.write("u\n");
      child.stdin.write("s\n");
      child.stdin.write("\n");
      child.stdin.write(`${id}\n`);

      child.on("close", () => {
        return checkIfEnd();
      });
    } catch (e) {
      const msg = await receivedMessage.channel.messages.fetch({
        around: loading.id,
        limit: 1
      });
      const fetchedMsg = msg.first();
      await fetchedMsg.edit(
        `${bar(interval + 1)} ${interval + 1}/${
          modsIdArray.length
        } downloading - ${modsNamesArray[interval]}`
      );
      console.log(
        `${bar(interval + 1)} ${interval + 1}/${
          modsIdArray.length
        } downloading - ${modsNamesArray[interval]}`
      );
      child.stdin.write("d\n");
      child.stdin.write(`${id}\n`);

      child.stdout.on("data", data => {
        // console.log(`${data}\n`);
        const searchInData = data.toString().search("Fixed upper case for MOD");
        if (searchInData !== -1) {
          // console.log(`its kinda working?`);
        }
      });

      child.on("close", code => {
        fs.symlink(
          `/home/propanek/Steam/steamapps/workshop/content/107410/${id}`,
          `/home/propanek/Steam/arma3/${id}`,
          err => {
            console.log(err);
          }
        );
        return checkIfEnd();
      });
    }
  };

  await download(modsIdArray[interval]);
};
