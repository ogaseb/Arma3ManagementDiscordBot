import { validatePermissions } from "../../helpers/helpers";
import { exec } from "child_process";
import fs from "fs";

export const lastLogs = async function(receivedMessage) {
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
