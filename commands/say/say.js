const { validateAdmin } = require("../../helpers/helpers");
module.exports.sayToUsers = async function(receivedMessage, bnode, message) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`say -1 ${message}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
