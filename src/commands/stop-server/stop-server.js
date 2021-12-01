import {
  validateAdmin,
  stopServer,
  checkIfServerIsOn
} from "../../helpers/helpers";

export const stopServerCommand = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    if (!checkIfServerIsOn()) {
      return receivedMessage.channel.send("Server jest już wyłączony");
    }

    await receivedMessage.channel.send("Wyłączam serwer...");
    await client.user.setActivity(`Serwer jest wyłączany...`, {
      type: "WATCHING"
    });

    stopServer();
    const interval = setInterval(async () => {
      if (!checkIfServerIsOn()) {
        clearInterval(interval);
        await receivedMessage.channel.send("Serwer został wyłączony.");
        await client.user.setActivity(`Serwer został wyłączony.`, {
          type: "WATCHING"
        });
      }
    }, 1000);
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
