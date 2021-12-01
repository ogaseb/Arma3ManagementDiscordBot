import { validateAdmin } from "../../helpers/helpers";

export const getBannedUsers = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.battleEyeRcon.sendCommand(`bans`, bans => {
      receivedMessage.channel.send("```" + bans + "```");
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
