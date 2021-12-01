import { validatePermissions } from "../../helpers/helpers";

export const reassignRoles = async function(receivedMessage, bnode) {
  if (validatePermissions(receivedMessage)) {
    bnode.battleEyeRcon.sendCommand(`#reassign`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
