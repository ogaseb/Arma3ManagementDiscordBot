import { validateAdmin } from "../../../helpers/helpers";
import { startPresetMission } from "../preset_missions";

export const startVindictaUnsung = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await startPresetMission(
      receivedMessage,
      client,
      "./bash/a3runscript_vindicta_unsung.sh"
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
