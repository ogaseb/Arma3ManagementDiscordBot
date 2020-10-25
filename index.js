require("dotenv").config();
const { Client } = require("discord.js");
const { regexes } = require("./helpers/helpers");
const cron = require("node-cron");
const BattleNode = require("battle-node");
const { pingServer } = require("./commands/ping/ping");
const { removeBan } = require("./commands/remove_ban/remove_ban");
const { checkIfDM } = require("./helpers/helpers");
const { getBannedUsers } = require("./commands/get_bans/get_bans");
const { banUser } = require("./commands/ban/ban");
const { reassignRoles } = require("./commands/reassign/reassign");
const { restartServer } = require("./commands/restart-server/restart-server");
const { setMission } = require("./commands/set_mission/set_mission");
const { kickUser } = require("./commands/kick/kick");
const { sayToUsers } = require("./commands/say/say");
const { getMissions } = require("./commands/get_missions/get_missions");
const { getPlayers } = require("./commands/players/players");
const { parseModList } = require("./commands/parse/parse");
const { sendMission } = require("./commands/mission/mission");
const { sendHelp } = require("./commands/help/help");

const client = new Client();
const config = {
  ip: process.env.RCON_IP,
  port: process.env.RCON_PORT,
  rconPassword: process.env.RCON_PASSWORD
};
let bnode = null;
let interval,
  timeout = null;

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

const battleEye = () => {
  bnode = null;
  console.log(bnode);
  bnode = new BattleNode(config);
  console.log(bnode);
  console.log(interval);
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  try {
    bnode.login();
    bnode.on("login", async (err, success) => {
      if (err) {
        console.log("Unable to connect to server.");
        return (timeout = setTimeout(async () => {
          if (bnode) bnode.socket.close();
          battleEye();
          return console.log("creating new battle class");
        }, 15000));
      }
      console.log(interval);
      console.log(timeout);
      if (success === true) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        interval = setInterval(async function() {
          bnode.sendCommand("players", async players => {
            let split = "";
            const player = players.split("\n");
            split = player[player.length - 1].split(" ")[0].split("(")[1];
            await client.user.setActivity(`graczy na serwerze: ${split}`, {
              type: "WATCHING"
            });
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
      console.log(interval);
      console.log(timeout);
      console.log("disconnected");
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      return (timeout = setTimeout(async () => {
        if (bnode) bnode.socket.close();
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

  cron.schedule(
    "30 17 * * 2,4",
    async () => {
      await client.channels.cache
        .get("753735965142417420")
        .send(
          `<@&753999685437489234> misja za pół godziny! Zbierać się powoli!`
        );
    },
    {}
  );

  cron.schedule(
    "30 16 * * 7",
    async () => {
      await client.channels.cache
        .get("753735965142417420")
        .send(
          `<@&753999685437489234> misja za pół godziny! Zbierać się powoli!`
        );
    },
    {}
  );
  battleEye();
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
    return parseModList(receivedMessage);
  }

  if (primaryCommand === "mission") {
    return sendMission(receivedMessage);
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
    return restartServer(receivedMessage, bnode);
  }

  if (primaryCommand === "reassign") {
    return reassignRoles(receivedMessage, bnode);
  }

  if (primaryCommand === "ping") {
    return pingServer(receivedMessage);
  }
};
