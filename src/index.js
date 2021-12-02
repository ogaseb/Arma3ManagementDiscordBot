import "dotenv/config";
import "colors";
import { Client } from "discord.js";
import { regexes } from "./helpers/helpers";
import cron from "node-cron";
import { lastLogs } from "./commands/last-logs/last-logs";
import { pingServer } from "./commands/ping/ping";
import { removeBan } from "./commands/remove_ban/remove_ban";
import { checkIfDM } from "./helpers/helpers";
import { getBannedUsers } from "./commands/get_bans/get_bans";
import { banUser } from "./commands/ban/ban";
import { reassignRoles } from "./commands/reassign/reassign";
import { restartServerCommand } from "./commands/restart-server/restart-server";
import { startServerCommand } from "./commands/start-server/start-server";
import { stopServerCommand } from "./commands/stop-server/stop-server";
import { setMission } from "./commands/set_mission/set_mission";
import { kickUser } from "./commands/kick/kick";
import { sayToUsers } from "./commands/say/say";
import { getMissions } from "./commands/get_missions/get_missions";
import { getPlayers } from "./commands/players/players";
import { parseModList } from "./commands/parse/parse";
import { sendMission } from "./commands/mission/mission";
import { sendHelp } from "./commands/help/help";
import { startVindicta } from "./commands/preset_missions/start-vindicta/start-vindicta";
import { startVindictaUnsung } from "./commands/preset_missions/start-vindicta-unsung/start-vindicta-unsung";
import { startDirectaction } from "./commands/preset_missions/start-directaction/start-directaction";
import { startAntistasiTaviana } from "./commands/preset_missions/start-antistasi-taviana/start-antistati-taviana";
import BattleNodeRcon from "./bnode/bnode";
import chmodr from "chmodr";
import path from "path";
import os from "os";

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
    console.log(os.homedir());
    console.log(path.join(process.cwd(), "/out.log"));
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
    return getPlayers(receivedMessage, battleEye);
  }

  if (primaryCommand === "get-missions") {
    return getMissions(receivedMessage, battleEye);
  }

  if (primaryCommand === "set-mission") {
    return setMission(receivedMessage, battleEye, messageArguments);
  }

  if (primaryCommand === "say") {
    return sayToUsers(receivedMessage, battleEye, messageArguments);
  }
  if (primaryCommand === "kick") {
    return kickUser(receivedMessage, battleEye, messageArguments);
  }

  if (primaryCommand === "ban") {
    return banUser(receivedMessage, battleEye, messageArguments);
  }

  if (primaryCommand === "remove-ban") {
    return removeBan(receivedMessage, battleEye, messageArguments);
  }

  if (primaryCommand === "get-bans") {
    return getBannedUsers(receivedMessage, battleEye);
  }

  if (primaryCommand === "restart-server") {
    return restartServerCommand(receivedMessage, client);
  }

  if (primaryCommand === "start-server") {
    return startServerCommand(receivedMessage, client);
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
    return stopServerCommand(receivedMessage, client);
  }

  if (primaryCommand === "reassign") {
    return reassignRoles(receivedMessage, battleEye);
  }

  if (primaryCommand === "ping") {
    return pingServer(receivedMessage);
  }

  if (primaryCommand === "last-logs") {
    return lastLogs(receivedMessage);
  }
};
