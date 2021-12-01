import { regexes } from "../../helpers/helpers";
import { validateAdmin } from "../../helpers/helpers";

export const banUser = async function(
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

    bnode.battleEyeRcon.sendCommand(
      `ban ${uid} ${reason.replace(/['"]+/g, "")}`
    );
    await receivedMessage.channel.send(
      `poszedł banik! powód: \`${reason}\` uid: \`${uid}\` czas: \`${time}\``
    );
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};

export default { banUser };
