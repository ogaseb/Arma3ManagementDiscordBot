require("dotenv").config();
const BattleNode = require("battle-node");
const { Client } = require("discord.js");
const { stopServer, regexes, checkIfServerIsOn } = require("./helpers/helpers");
const cron = require("node-cron");
const { lastLogs } = require("./commands/last-logs/last-logs");
const { pingServer } = require("./commands/ping/ping");
const { removeBan } = require("./commands/remove_ban/remove_ban");
const { checkIfDM } = require("./helpers/helpers");
const { getBannedUsers } = require("./commands/get_bans/get_bans");
const { banUser } = require("./commands/ban/ban");
const { reassignRoles } = require("./commands/reassign/reassign");
const { restartServer } = require("./commands/restart-server/restart-server");
const { startServer } = require("./commands/start-server/start-server");
const {
  stopServer: stopCommandServer
} = require("./commands/stop-server/stop-server");
const { setMission } = require("./commands/set_mission/set_mission");
const { kickUser } = require("./commands/kick/kick");
const { sayToUsers } = require("./commands/say/say");
const { getMissions } = require("./commands/get_missions/get_missions");
const { getPlayers } = require("./commands/players/players");
const { parseModList } = require("./commands/parse/parse");
const { sendMission } = require("./commands/mission/mission");
const { sendHelp } = require("./commands/help/help");
const { startVindicta } = require("./commands/start-vindicta/start-vindicta");
const {
  startVindictaUnsung
} = require("./commands/start-vindicta-unsung/start-vindicta-unsung");
const {
  startDirectaction
} = require("./commands/start-directaction/start-directaction");
const {
  startAntistasiTaviana
} = require("./commands/start-antistasi-taviana/start-antistati-taviana");

const client = new Client();

const config = {
  ip: process.env.RCON_IP,
  port: process.env.RCON_PORT,
  rconPassword: process.env.RCON_PASSWORD
};

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

let interval,
  timeout,
  switchServerOffInterval,
  bnode = null;
const timeToSwitchOffServer = 1800000;

const battleEye = () => {
  const clearIntervals = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (switchServerOffInterval) {
      clearTimeout(switchServerOffInterval);
      switchServerOffInterval = null;
    }
  };
  clearIntervals();
  try {
    bnode = new BattleNode(config);
    bnode.login();
    bnode.on("login", async (err, success) => {
      if (err) {
        return (timeout = setTimeout(async () => {
          if (bnode) bnode.socket.close();
          bnode = null;
          battleEye();
          return console.log("creating new battle class");
        }, 15000));
      }
      if (success === true) {
        clearIntervals();
        interval = setInterval(async function() {
          bnode.sendCommand("players", async players => {
            let split = "";
            const player = players.split("\n");
            split = player[player.length - 1].split(" ")[0].split("(")[1];

            await client.user.setActivity(`graczy na serwerze: ${split}`, {
              type: "WATCHING"
            });
            console.log(parseInt(split));

            if (parseInt(split) > 0) {
              console.log("there are players here stop countdown!");
              clearTimeout(switchServerOffInterval);
              switchServerOffInterval = null;
            } else if (parseInt(split) === 0) {
              console.log("there no players here countdown started");
              if (switchServerOffInterval === null) {
                switchServerOffInterval = setTimeout(() => {
                  console.log("now stopping serwer");
                  stopServer();
                  let checkServerInterval = setInterval(() => {
                    if (!checkIfServerIsOn()) {
                      clearInterval(checkServerInterval);
                      checkServerInterval = null;
                      return client.user.setActivity(
                        `Serwer został wyłączony.`,
                        {
                          type: "WATCHING"
                        }
                      );
                    }
                  }, 1000);
                }, timeToSwitchOffServer);
              }
            }
          });
        }, 10000);

        console.log("Logged in RCON successfully.");
      } else if (success === false) {
        console.log("RCON login failed! (password may be incorrect)");
      }
    });

    bnode.on("message", async function(message) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      console.log(message.toString().replace(regexes.IPS, "x.x.x.x"));
      const checkIfAdminLogin = message.split(" ");
      if (
        checkIfAdminLogin[0] === "RCon" &&
        checkIfAdminLogin[1] === "admin" &&
        checkIfAdminLogin[checkIfAdminLogin.length - 2] === "logged" &&
        checkIfAdminLogin[checkIfAdminLogin.length - 1] === "in"
      ) {
        return;
      }
      await client.channels.cache
        .get(process.env.BOT_LOGS_ID)
        .send(message.toString().replace(regexes.IPS, "x.x.x.x"));
    });

    bnode.on("disconnected", async function() {
      console.log("disconnected");
      clearIntervals();

      return (timeout = setTimeout(async () => {
        if (bnode) bnode.socket.close();
        bnode = null;
        battleEye();
        return console.log("creating new battle class");
      }, 15000));
    });
  } catch (e) {
    console.log(e);
  }
};

client.on("ready", async () => {
  console.log("On Discord!");
  console.log("Connected as " + client.user.tag);
  console.log("Servers:");
  Array.from(client.guilds.cache.values()).forEach(guild => {
    console.log(" - " + guild.id);
    Array.from(guild.channels.cache.values()).forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });
  battleEye();
  await client.user.setActivity(`Serwer jest wyłączony`, {
    type: "WATCHING"
  });

  cron.schedule(
    "30 17 * * 7",
    async () => {
      await client.channels.cache
        .get("867800656344514590")
        .send(
          `<@&868948657825779762> misja za pół godziny! Zbierać się powoli!`
        );
    },
    {}
  );
});

client.on("message", receivedMessage => {
  if (checkIfDM(receivedMessage)) return;
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
    return parseModList(receivedMessage, client);
  }

  if (primaryCommand === "mission") {
    return sendMission(receivedMessage, client);
  }

  if (primaryCommand === "help") {
    return sendHelp(receivedMessage).build();
  }

  if (primaryCommand === "players") {
    return getPlayers(receivedMessage, bnode);
  }

  if (primaryCommand === "get-missions") {
    return getMissions(receivedMessage, bnode);
  }

  if (primaryCommand === "set-mission") {
    return setMission(receivedMessage, bnode, messageArguments);
  }

  if (primaryCommand === "say") {
    return sayToUsers(receivedMessage, bnode, messageArguments);
  }
  if (primaryCommand === "kick") {
    return kickUser(receivedMessage, bnode, messageArguments);
  }

  if (primaryCommand === "ban") {
    return banUser(receivedMessage, bnode, messageArguments);
  }

  if (primaryCommand === "remove-ban") {
    return removeBan(receivedMessage, bnode, messageArguments);
  }

  if (primaryCommand === "get-bans") {
    return getBannedUsers(receivedMessage, bnode);
  }

  if (primaryCommand === "restart-server") {
    return restartServer(receivedMessage, client);
  }

  if (primaryCommand === "start-server") {
    return startServer(receivedMessage, client);
  }

  if (primaryCommand === "start-vindicta") {
    return startVindicta(receivedMessage, client);
  }

  if (primaryCommand === "start-unsung") {
    return startVindictaUnsung(receivedMessage, client);
  }

  if (primaryCommand === "start-directaction") {
    return startDirectaction(receivedMessage, client);
  }

  if (primaryCommand === "start-antistasi-taviana") {
    return startAntistasiTaviana(receivedMessage, client);
  }

  if (primaryCommand === "stop-server") {
    return stopCommandServer(receivedMessage, client);
  }

  if (primaryCommand === "reassign") {
    return reassignRoles(receivedMessage, bnode);
  }

  if (primaryCommand === "ping") {
    return pingServer(receivedMessage);
  }

  if (primaryCommand === "last-logs") {
    return lastLogs(receivedMessage);
  }
};
