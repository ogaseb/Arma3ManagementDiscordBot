import { checkIfServerIsOn, pingServer } from "../../helpers/helpers";
import fs from "fs";
import { spawn } from "child_process";

export const startPresetMission = async function(
  receivedMessage,
  client,
  command
) {
  await client.user.setActivity(`Serwer jest uruchamiany...`, {
    type: "WATCHING"
  });
  pingServer(receivedMessage);

  fs.unlink("./out.log", function(err) {
    if (err) return console.log(err);
    console.log("last logs removed");
  });

  const pid = fs.readFileSync("./arma3.pid", "utf8");
  console.log(pid);

  if (require("is-running")(parseInt(pid))) {
    process.kill(parseInt(pid));
  }

  const interval = setInterval(async () => {
    if (!checkIfServerIsOn()) {
      clearInterval(interval);
      const out = fs.openSync("./out.log", "a");
      const err = fs.openSync("./out.log", "a");
      spawn(command, [], {
        detached: true,
        stdio: ["ignore", out, err]
      }).unref();
    }
  }, 1000);
};
