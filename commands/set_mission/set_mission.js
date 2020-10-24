const { regexes } = require("../../helpers/helpers");
const { validateAdmin } = require("../../helpers/helpers");
module.exports.setMission = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  const mission = messageArguments[0];

  if (validateAdmin(receivedMessage)) {
    if (!regexes.MESSAGE.test(mission)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (nazwa misji)`
      );
    }

    bnode.sendCommand(`#mission ${mission}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
