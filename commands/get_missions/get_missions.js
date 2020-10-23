module.exports.getMissions = function(receivedMessage, bnode) {
  bnode.sendCommand("missions", async missions => {
    receivedMessage.channel.send("```" + missions + "```");
  });
};
