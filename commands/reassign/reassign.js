const { validateAdmin } = require("../../helpers/helpers");
module.exports.reassignRoles = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`#reassign`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
