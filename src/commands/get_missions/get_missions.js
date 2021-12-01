import { validatePermissions } from "../../helpers/helpers";

export const getMissions = async function(receivedMessage, bnode) {
  if (validatePermissions(receivedMessage)) {
    bnode.battleEyeRcon.sendCommand("missions", async missions => {
      receivedMessage.channel.send("```" + missions + "```");
    });
  } else {
    return await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
