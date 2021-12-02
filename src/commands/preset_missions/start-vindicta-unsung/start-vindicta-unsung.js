import { validateAdmin } from "../../../helpers/helpers";
import { startPresetMission } from "../preset_missions";
import path from "path";

export const startVindictaUnsung = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await startPresetMission(
      receivedMessage,
      client,
      path.join(__dirname, "./bash/a3runscript_vindicta_unsung.sh")
    );
    await receivedMessage.channel.send(
      "Uruchamiam server z Vindicta Unsung..."
    );
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
