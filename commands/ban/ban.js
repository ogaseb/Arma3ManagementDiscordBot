const { regexes } = require("../../helpers/helpers");
const { validateAdmin } = require("../../helpers/helpers");
module.exports.banUser = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  const reason = messageArguments[0];
  const uid = messageArguments[1];
  const time = messageArguments[2];

  console.log(messageArguments, uid, reason);
  if (validateAdmin(receivedMessage)) {
    if (!reason.match(regexes.MESSAGE)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (powód)`
      );
    }

    if (isNaN(uid)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (id usera)`
      );
    }

    if (isNaN(time)) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (czas trwania w minutach)`
      );
    }

    bnode.sendCommand(`ban ${uid} ${reason.replace(/['"]+/g, "")}`);
    await receivedMessage.channel.send(
      `poszedł banik! powód: \`${reason}\` uid: \`${uid}\` czas: \`${time}\``
    );
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
