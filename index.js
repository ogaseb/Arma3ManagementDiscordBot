require("dotenv").config();
const { Client } = require("discord.js");
const { regexes } = require("./helpers/helpers");
const cron = require("node-cron");
const BattleNode = require("battle-node");
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

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

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
          `<@!753999685437489234> misja za pół godziny! Zbierać się powoli!`
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
          `<@!753999685437489234> misja za pół godziny! Zbierać się powoli!`
        );
    },
    {}
  );

  try {
    const config = {
      ip: process.env.RCON_IP,
      port: process.env.RCON_PORT,
      rconPassword: process.env.RCON_PASSWORD
    };
    const bnode = new BattleNode(config);
    bnode.login();

    let interval;
    bnode.on("login", async (err, success) => {
      if (err) {
        console.log("Unable to connect to server.");
      }

      if (success === true) {
        bnode.connected = true;
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!bnode.connected) {
            bnode.login();
          }
        }, 1000);

        await client.channels.cache
          .get(process.env.BOT_LOGS_ID)
          .send("Logged in RCON successfully.");
        console.log("Logged in RCON successfully.");
      } else if (success === false) {
        bnode.login();
        console.log("RCON login failed! (password may be incorrect)");
      }
    });

    bnode.on("message", async function(message) {
      console.log(message.toString().replace(regexes.IPS, "x.x.x.x"));
      await client.channels.cache
        .get(process.env.BOT_LOGS_ID)
        .send(message.toString().replace(regexes.IPS, "x.x.x.x"));
    });

    setInterval(async function() {
      bnode.sendCommand("players", async players => {
        let split = "";
        const player = players.split("\n");
        split = player[player.length - 1].split(" ")[0].split("(")[1];
        await client.user.setActivity(`graczy na serwerze: ${split}`, {
          type: "WATCHING"
        });
      });
    }, 10000);

    bnode.on("disconnected", async function() {
      bnode.connected = false;
      await client.channels.cache
        .get(process.env.BOT_LOGS_ID)
        .send("lost connection to rcon reconnecting...");
    });
  } catch (e) {
    console.log(e);
  }
});

client.on("message", receivedMessage => {
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

  if (primaryCommand === "restart-server") {
    return restartServer(receivedMessage, bnode);
  }

  if (primaryCommand === "reassign") {
    return reassignRoles(receivedMessage, bnode);
  }
};
