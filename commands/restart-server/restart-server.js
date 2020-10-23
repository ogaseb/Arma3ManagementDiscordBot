const { validateAdmin } = require("../../helpers/helpers");
module.exports.restartServer = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`#restartserver`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
