const { validateAdmin } = require("../../helpers/helpers");
module.exports.getBannedUsers = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand(`bans`, bans => {
      receivedMessage.channel.send("```" + bans + "```");
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
