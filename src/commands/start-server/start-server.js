import {
  startServer,
  checkIfServerIsOn,
  validatePermissions,
  pingServer
} from "../../helpers/helpers";

export const startServerCommand = async function(receivedMessage, client) {
  if (validatePermissions(receivedMessage)) {
    if (checkIfServerIsOn()) {
      return receivedMessage.channel.send("Server już jest uruchomiony");
    }

    await receivedMessage.channel.send("Uruchamiam server...");
    await client.user.setActivity(`Serwer jest uruchamiany...`, {
      type: "WATCHING"
    });

    pingServer(receivedMessage);
    startServer();
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
