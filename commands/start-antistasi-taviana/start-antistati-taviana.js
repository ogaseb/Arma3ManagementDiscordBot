const { validateAdmin, checkIfServerIsOn } = require("../../helpers/helpers");
const Gamedig = require("gamedig");
const fs = require("fs");
const { spawn } = require("child_process");

module.exports.startAntistasiTaviana = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await receivedMessage.channel.send("Uruchamiam server z Antistasi Taviana");
    await client.user.setActivity(`Serwer jest uruchamiany...`, {
      type: "WATCHING"
    });

    setTimeout(() => {
      Gamedig.query({
        type: "arma3",
        host: "127.0.0.1",
        maxAttempts: 1000
      })
        .then(async state => {
          await receivedMessage.channel.send("Serwer powinien już działać!");
        })
        .catch(async error => {
          await receivedMessage.channel.send(
            "Jednak coś się zwaliło i nie wstał..."
          );
        });
    }, 5000);

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
        spawn("./a3runscript_antistasi_taviana.sh", [], {
          detached: true,
          stdio: ["ignore", out, err]
        }).unref();
      }
    }, 1000);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
