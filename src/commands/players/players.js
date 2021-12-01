import { validatePermissions } from "../../helpers/helpers";
import { regexes } from "../../helpers/helpers";

export const getPlayers = async function(receivedMessage, bnode) {
  if (validatePermissions(receivedMessage)) {
    bnode.battleEyeRcon.sendCommand("players", async players => {
      receivedMessage.channel.send(
        "```" + players.toString().replace(regexes.IPS, "x.x.x.x") + "```"
      );
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
