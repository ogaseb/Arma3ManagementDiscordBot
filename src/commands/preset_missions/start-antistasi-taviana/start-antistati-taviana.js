import { validateAdmin } from "../../../helpers/helpers";
import { startPresetMission } from "../preset_missions";
import path from "path";

export const startAntistasiTaviana = async function(receivedMessage, client) {
  if (validateAdmin(receivedMessage)) {
    await startPresetMission(
      receivedMessage,
      client,
      path.join(__dirname, "./bash/a3runscript_antistasi_taviana.sh")
    );
    await receivedMessage.channel.send("Uruchamiam server z Antistasi Taviana");
  } else {
    await receivedMessage.channel.send(
      `Nie masz uprawnień do korzystania z tego!`
    );
  }
};
