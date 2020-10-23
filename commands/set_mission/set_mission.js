const { validateAdmin } = require("../../helpers/helpers");
module.exports.setMission = async function(receivedMessage, bnode, mission) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`#mission ${mission}`);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
