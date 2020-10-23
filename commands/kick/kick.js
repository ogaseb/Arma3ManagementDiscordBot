const { validateAdmin } = require("../../helpers/helpers");
module.exports.kickUser = async function(receivedMessage, bnode, reason, uid) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`kick ${uid} ${reason}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
