const { validatePermissions } = require("../../helpers/helpers");
const { regexes } = require("../../helpers/helpers");

module.exports.getPlayers = async function(receivedMessage, bnode) {
  if (validatePermissions(receivedMessage)) {
    bnode.sendCommand("players", async players => {
      console.log(players.toString());
      receivedMessage.channel.send(
        "```" + players.toString().replace(regexes.IPS, "x.x.x.x") + "```"
      );
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
