const { regexes } = require("../../helpers/helpers");
const { validateAdmin } = require("../../helpers/helpers");
module.exports.sayToUsers = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  console.log(messageArguments);
  const message = messageArguments[0];

  if (validateAdmin(receivedMessage)) {
    if (!message) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (wiadomość)`
      );
    } else {
      bnode.sendCommand(`say -1 ${message.replace(/['"]+/g, "")}`);
    }
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
