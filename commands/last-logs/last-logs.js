const { validatePermissions } = require("../../helpers/helpers");
const { exec } = require("child_process");
const fs = require("fs");

module.exports.lastLogs = async function(receivedMessage) {
  if (validatePermissions(receivedMessage)) {
    exec("tail -n 100 ./out.log > last_100_logs.log");
    await receivedMessage.channel.send(" ", {
      files: [`./last_100_logs.log`]
    });
    fs.unlink("./last_100_logs.log", function(err) {
      if (err) return console.log(err);
      console.log("last logs removed");
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
