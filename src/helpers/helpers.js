const { spawn } = require("child_process");
const fs = require("fs");
const Gamedig = require("gamedig");

const regexes = {
  ARGUMENTS: /\b\w*parse|mission|help|players|get-missions|say|kick|set-mission|restart-server|start-server|stop-server|start-vindicta|start-unsung|start-directaction|start-antistasi-taviana|reassign|ban|get-bans|remove-ban|ping|last-logs\w*\b|-?[0-9]\d*(\.\d+)?|"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“|(<[^]*[>$])/gm,
  COMMANDS: /\b\w*parse|mission|help|players|get-missions|say|kick|set-mission|restart-server|start-server|stop-server|start-vindicta|start-unsung|start-directaction|start-antistasi-taviana|reassign|ban|get-bans|remove-ban|ping|last-logs\w*\b/gm,
  CONTENT: /"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“/gm,
  NUMBER: /^(?!.*<@)-?[0-9]\d*(\.\d+)?/gm,
  MENTION: /(<[^]*[>$])/gm,
  EXTRACT_MENTION_ID: /(?<=<@!)(.*)(?=>)/gm,
  LINK: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/gm,
  LOWERCASE: /^[A-Z0-9-+_!@#$%^&*;:{}\\/=|()~<>.,?ĄĆĘŁŃÓŚŹŻ\[\]"'`]+$|(\:(.*?)\:)|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm,
  MESSAGE: /"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“/gm,
  IPS: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gm
};

function filteredRegexes(array) {
  return Object.keys(regexes)
    .filter(key => array.includes(key))
    .reduce((obj, key) => {
      obj[key] = regexes[key];
      return obj;
    }, {});
}

function checkIfDM(receivedMessage) {
  return receivedMessage.channel.type === "dm";
}

function validatePermissions(receivedMessage) {
  if (!checkIfDM(receivedMessage)) {
    return !!receivedMessage.member._roles.find(role =>
      process.env.BOT_PERMISSIONS_ROLES.includes(role)
    );
  }
}

function validateAdmin(receivedMessage) {
  if (!checkIfDM(receivedMessage)) {
    return !!receivedMessage.member._roles.find(role =>
      process.env.BOT_ADMIN_ROLES.includes(role)
    );
  }
}

function checkLogsFileSizeAndRemove() {
  const fileSize = fs.statSync("./out.log");
  const logsFileSize = (fileSize.size / (1024 * 1024)).toFixed(2);
  if (logsFileSize > 50) {
    fs.unlink("./out.log", function(err) {
      if (err) return console.log(err);
      console.log("logs removed");
    });
  }
}

function stopServer() {
  checkLogsFileSizeAndRemove();
  const pid = fs.readFileSync("./arma3.pid", "utf8");
  if (require("is-running")(parseInt(pid))) {
    process.kill(parseInt(pid));
  }
}

function startServer() {
  const out = fs.openSync("./out.log", "a");
  const err = fs.openSync("./out.log", "a");
  spawn("./bash/a3runscript.sh", [], {
    detached: true,
    stdio: ["ignore", out, err]
  }).unref();
}

function restartServer() {
  checkLogsFileSizeAndRemove();
  const pid = fs.readFileSync("./arma3.pid", "utf8");

  if (require("is-running")(parseInt(pid))) {
    process.kill(parseInt(pid));
  }

  const interval = setInterval(async () => {
    if (!checkIfServerIsOn()) {
      clearInterval(interval);
      const out = fs.openSync("./out.log", "a");
      const err = fs.openSync("./out.log", "a");
      spawn("./bash/a3runscript.sh", [], {
        detached: true,
        stdio: ["ignore", out, err]
      }).unref();
    }
  }, 1000);
}

function checkIfServerIsOn() {
  const pid = fs.readFileSync("./arma3.pid", "utf8");
  if (pid) {
    return require("is-running")(parseInt(pid));
  }
}

function pingServer(receivedMessage) {
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
}

module.exports = {
  regexes,
  checkIfDM,
  validatePermissions,
  validateAdmin,
  restartServer,
  stopServer,
  startServer,
  checkIfServerIsOn,
  pingServer
};
