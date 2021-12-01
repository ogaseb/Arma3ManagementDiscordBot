import {
  validateAdmin,
  restartServer,
  pingServer
} from "../../helpers/helpers";

export const restartServerCommand = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await receivedMessage.channel.send(
      "Restartuje serwer, dam info kiedy wstanie poczekaj..."
    );
    pingServer(receivedMessage);
    restartServer();
    await client.user.setActivity(`Serwer restart.`, {
      type: "WATCHING"
    });
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
