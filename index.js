require("dotenv").config();
const { Client } = require("discord.js");

const client = new Client();

void (async function() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

client.on("ready", async () => {
  console.log("On Discord!");
  console.log("Connected as " + client.user.tag);
  console.log("Servers:");
  client.guilds.forEach(guild => {
    console.log(" - " + guild.id);
    guild.channels.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });

  setInterval(async () => {
    // await client.user.setActivity(`QR Codes count: ${qrCount.count}`, {
    //   type: "WATCHING"
    // });
  }, 30000);

  // setInterval(async () => {
  //   await urlStatus(client);
  // }, 1000 * 60 * 60 * 24);
});

client.on("message", receivedMessage => {
  if (receivedMessage.author === client.user) {
    return;
  }

  if (receivedMessage.content.startsWith(`!`)) {
    processCommand(receivedMessage);
  }
});

client.on("guildMemberUpdate", async receivedMessage => {
  // console.log(client.users.get(receivedMessage.user.id))
  const guild = client.guilds.get(process.env.GUILD_ID);
  const role = guild.roles.find(role => role.name === "testrole");

  console.log(role.members.get(receivedMessage.user.id));
  if (role.members.get(receivedMessage.user.id)) {
    await client.channels
      .get("648233738324541460")
      .send(
        `EJ KURWA W TYCH BUTACH NIE WEJDZIESZ WYPIERDALAJ <@${receivedMessage.user.id}>`
      );
  }

  // console.log(client.channels.get('648233738324541460'))
  // receivedMessage.channel.send(`EJ KURWA W TYCH BUTACH NIE WEJDZIESZ WYPIERDALAJ <@${receivedMessage.user.id}>`)
});

function processCommand(receivedMessage) {
  let fullCommand, primaryCommand;

  // if (messageArguments !== null && messageArguments.length) {
  //   primaryCommand = messageArguments[0]; // The first word directly after the exclamation is the command
  // }

  fullCommand = receivedMessage.content.substr(1);
  if (!fullCommand) {
    receivedMessage.channel.send(
      `EJ TYPIE O CO CI CHODZI WPISZ "!POMOC" JEŚLI MUSZE TAKIEGO FRAJERA ZA RĄCZKE PROWADZI`
    );
  }

  if (fullCommand === "init") {
    console.log("init");
    // console.log(receivedMessage)
    const guild = client.guilds.get(process.env.GUILD_ID);
    const members = guild.roles.find(role => role.name === "testrole").members;

    for (const role of members) {
      console.log(role[1].user);
    }
    return;
  }

  if (fullCommand === "RANKING") {
    console.log("ranking");
    return;
  }

  if (fullCommand === "POMOC") {
    console.log("pomoc");
    return;
  }
}
