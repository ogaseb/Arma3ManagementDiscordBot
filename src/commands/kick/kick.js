import { regexes } from "../../helpers/helpers";
import { validateAdmin } from "../../helpers/helpers";

export const kickUser = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  const reason = messageArguments[0];
  const uid = messageArguments[1];
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

    bnode.battleEyeRcon.sendCommand(
      `kick ${uid} ${reason.replace(/['"]+/g, "")}`
    );
    await receivedMessage.channel.send(
      `poszedł kick! powód: \`${reason}\` uid: \`${uid}\``
    );
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
