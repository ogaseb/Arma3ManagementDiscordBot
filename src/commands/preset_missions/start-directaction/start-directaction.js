import { validateAdmin } from "../../../helpers/helpers";
import { startPresetMission } from "../preset_missions";

export const startDirectaction = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await startPresetMission(
      receivedMessage,
      client,
      "./bash/a3runscript_direct_action.sh"
    );
    await receivedMessage.channel.send("Uruchamiam server z Direct Action...");
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
