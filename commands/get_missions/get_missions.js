const { validatePermissions } = require("../../helpers/helpers");

module.exports.getMissions = async function(receivedMessage, bnode) {
  if (validatePermissions(receivedMessage)) {
    bnode.sendCommand("missions", async missions => {
      receivedMessage.channel.send("```" + missions + "```");
    });
  } else {
    return await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
