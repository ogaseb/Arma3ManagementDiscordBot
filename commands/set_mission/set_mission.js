const { validatePermissions } = require("../../helpers/helpers");
const { regexes } = require("../../helpers/helpers");
module.exports.setMission = async function(
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

    bnode.sendCommand(`#mission ${mission.replace(/['"]+/g, "")}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
