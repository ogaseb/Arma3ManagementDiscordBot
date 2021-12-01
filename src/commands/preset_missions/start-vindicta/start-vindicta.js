import { validateAdmin } from "../../../helpers/helpers";
import { startPresetMission } from "../preset_missions";

export const startVindicta = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await startPresetMission(
      receivedMessage,
      client,
      path.join(__dirname, "../../a3runscript_vindicta.sh")
    );
    await receivedMessage.channel.send("Uruchamiam server z Vindicta...");
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
