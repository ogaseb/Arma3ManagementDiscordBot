import { validateAdmin } from "../../helpers/helpers";
export const sayToUsers = async function(
  receivedMessage,
  bnode,
  messageArguments
) {
  console.log(messageArguments);
  const message = messageArguments[0];

  if (validateAdmin(receivedMessage)) {
    if (!message) {
      return await receivedMessage.channel.send(
        `Komenda jest źle wpisana! (wiadomość)`
      );
    } else {
      bnode.battleEyeRcon.sendCommand(
        `say -1 ${message.replace(/['"]+/g, "")}`
      );
    }
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
