const { validateAdmin } = require("../../helpers/helpers");

module.exports.getPlayers = async function(receivedMessage, bnode) {
  if (validateAdmin(receivedMessage)) {
    bnode.sendCommand("players", async players => {
      receivedMessage.channel.send("```" + players + "```");
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
