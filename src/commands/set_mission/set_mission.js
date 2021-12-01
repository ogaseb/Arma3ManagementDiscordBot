import { validatePermissions } from "../../helpers/helpers";
import { regexes } from "../../helpers/helpers";

export const setMission = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  const mission = messageArguments[0];

  if (validatePermissions(receivedMessage)) {
    if (!mission.match(regexes.MESSAGE)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (nazwa misji)`
      );
    }
    console.log(`#mission ${mission.replace(/['"]+/g, "")}`);
    bnode.battleEyeCron.sendCommand(
      `#mission ${mission.replace(/['"]+/g, "")}`
    );
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
