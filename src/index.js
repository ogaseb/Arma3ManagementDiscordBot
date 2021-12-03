import "dotenv/config";
import "colors";
import { Client } from "discord.js";
import { regexes } from "./helpers/helpers";
import cron from "node-cron";
import { checkIfDM } from "./helpers/helpers";
import BattleNodeRcon from "./bnode/bnode";
import chmodr from "chmodr";
import path from "path";
import {
  lastLogs,
  pingServer,
  removeBan,
  getBannedUsers,
  banUser,
  reassignRoles,
  restartServerCommand,
  startServerCommand,
  stopServerCommand,
  setMission,
  kickUser,
  sayToUsers,
  getMissions,
  getPlayers,
  parseModList,
  sendMission,
  sendHelp,
  startVindicta,
  startVindictaUnsung,
  startDirectaction,
  startAntistasiTaviana
} from "./commands/index";

chmodr(path.join(__dirname, "./bash"), 0o777, err => {
  if (err) {
    console.log("Failed to execute chmod", err);
  } else {
    console.log("Success");
  }
});
const client = new Client();
const battleEye = new BattleNodeRcon(client);

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

client.on("ready", async () => {
  battleEye.initBattleEye();
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

  switch (primaryCommand) {
    case "parse":
      return parseModList(receivedMessage, client);
    case "mission":
      return sendMission(receivedMessage, client);
    case "help":
      return sendHelp(receivedMessage).build();
    case "players":
      return getPlayers(receivedMessage, battleEye);
    case "get-missions":
      return getMissions(receivedMessage, battleEye);
    case "set-mission":
      return setMission(receivedMessage, battleEye, messageArguments);
    case "say":
      return sayToUsers(receivedMessage, battleEye, messageArguments);
    case "kick":
      return kickUser(receivedMessage, battleEye, messageArguments);
    case "ban":
      return banUser(receivedMessage, battleEye, messageArguments);
    case "remove-ban":
      return removeBan(receivedMessage, battleEye, messageArguments);
    case "get-bans":
      return getBannedUsers(receivedMessage, battleEye);
    case "restart-server":
      return restartServerCommand(receivedMessage, client);
    case "start-server":
      return startServerCommand(receivedMessage, client);
    case "start-vindicta":
      return startVindicta(receivedMessage, client);
    case "start-unsung":
      return startVindictaUnsung(receivedMessage, client);
    case "start-directaction":
      return startDirectaction(receivedMessage, client);
    case "start-antistasi-taviana":
      return startAntistasiTaviana(receivedMessage, client);
    case "stop-server":
      return stopServerCommand(receivedMessage, client);
    case "reassign":
      return reassignRoles(receivedMessage, battleEye);
    case "ping":
      return pingServer(receivedMessage);
    case "last-logs":
      return lastLogs(receivedMessage);
  }
};
