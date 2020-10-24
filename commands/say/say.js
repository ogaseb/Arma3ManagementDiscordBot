const { regexes } = require("../../helpers/helpers");
const { validateAdmin } = require("../../helpers/helpers");
module.exports.sayToUsers = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  const message = messageArguments[0];

  if (validateAdmin(receivedMessage)) {
    if (!regexes.MESSAGE.test(message)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (wiadomość)`
      );
    }
    bnode.sendCommand(`say -1 ${message.replace(/['"]+/g, "")}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
