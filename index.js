require("dotenv").config();
const { Client } = require("discord.js");
const { orderBy } = require("lodash");
const { regexes, filteredRegexes } = require("./helpers/helpers");
const {
  addWixxaUser,
  getWixxaUser,
  updateWixxaPoints,
  getAllWixxaUsers
} = require("./controller/WixxaUsersController");

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

  await client.user.setActivity(`BRAMKE NA WEJŚCIU`, {
    type: "WATCHING"
  });

  // setInterval(async () => {
  //   await urlStatus(client);
  // }, 1000 * 60 * 60 * 24);
});

client.on("message", receivedMessage => {
  if (receivedMessage.author === client.user) {
    return;
  }

  if (receivedMessage.content.startsWith(`!`)) {
    return processCommand(receivedMessage);
  } else {
    return processText(receivedMessage);
  }
});

client.on("guildMemberUpdate", async receivedMessage => {
  const guild = client.guilds.get(process.env.GUILD_ID);
  const role = guild.roles.find(role => role.name === "WIXIARA");
  const user = role.members.get(receivedMessage.user.id);

  if (user) {
    const obj = {
      discordId: user.id,
      name: user.username,
      wixxaPoints: 0
    };
    await addWixxaUser(obj);
    await client.channels
      .get(process.env.CHANNEL_ID)
      .send(`NO ELO <@${receivedMessage.user.id}>`);
  }
});

const processCommand = async receivedMessage => {
  let fullCommand, primaryCommand;

  fullCommand = receivedMessage.content.substr(1);
  if (!fullCommand) {
    receivedMessage.channel.send(
      `EJ TYPIE O CO CI CHODZI WPISZ "!POMOC" MAM CIE ZA REKE PROWADZIC?`
    );
  }

  const messageArguments = fullCommand.match(regexes.ARGUMENTS);

  if (messageArguments !== null && messageArguments.length) {
    primaryCommand = messageArguments[0]; // The first word directly after the exclamation is the command
    messageArguments.splice(0, 1);
  }
  console.log("primary command: " + primaryCommand);
  console.log("arguments: " + messageArguments);

  console.log(fullCommand);

  if (primaryCommand === "INIT") {
    const guild = client.guilds.get(process.env.GUILD_ID);
    const members = guild.roles.find(role => role.name === "WIXIARA").members;
    for (const role of members) {
      const obj = {
        discordId: role[1].user.id,
        name: role[1].user.username,
        wixxaPoints: 0
      };
      addWixxaUser(obj);
    }
    return;
  }

  if (primaryCommand === "RANKING") {
    console.log("ranking");
    const users = await getAllWixxaUsers();
    let usersArray = [];
    users.forEach(user => {
      usersArray.push(user.dataValues);
    });

    const result = orderBy(usersArray, ["wixxaPoints"], ["desc"]);

    let responseString = `\`\`\`RANKING\n`;
    result.forEach((item, index) => {
      responseString += `${index + 1}. ${item.name}: ${
        item.wixxaPoints
      } PUNKTÓW MŁYNNU \n`;
    });
    responseString += `\`\`\``;
    return receivedMessage.channel.send(responseString);
  }

  if (primaryCommand === "ZASADY") {
    console.log("pomoc");
    return;
  }

  if (
    primaryCommand === "WIXA" &&
    receivedMessage.channel.id === process.env.ADMIN_CHANNEL_ID
  ) {
    console.log("wixa", messageArguments);

    const regexesObj = filteredRegexes(["CONTENT", "NUMBER", "MENTION"]);

    let foundArgsObj = {};
    for (const regex in regexesObj) {
      if (regexesObj.hasOwnProperty(regex)) {
        const itemIndex = await messageArguments.findIndex(value =>
          value.match(regexesObj[regex])
        );
        if (itemIndex === -1) {
          await receivedMessage.channel.send(
            `invalid arguments \`${regex}\` for upload command`
          );
        } else {
          foundArgsObj[regex] = messageArguments[itemIndex];
          messageArguments.splice(itemIndex, 1);
        }
      }
    }

    const discordId = foundArgsObj.MENTION.match(regexes.EXTRACT_MENTION_ID);
    console.log(discordId);
    const user = await getWixxaUser(discordId);
    user.dataValues.wixxaPoints += parseInt(foundArgsObj.NUMBER);
    const newUser = await updateWixxaPoints(user);
    return client.channels
      .get(process.env.CHANNEL_ID)
      .send(
        `${foundArgsObj.MENTION} DOSTAŁEŚ ${
          foundArgsObj.NUMBER < 0 ? `KARNE` : `BONUSOWE`
        } PUNKTY W ILOŚCI \`${foundArgsObj.NUMBER}\` ZA ${
          foundArgsObj.CONTENT
        } W SUMIE TO MASZ ICH JUŻ \`${newUser[1][0].dataValues.wixxaPoints}\``
      );
  }
};

const processText = async receivedMessage => {
  console.log(receivedMessage.member.user.id);
  const message = receivedMessage.content.split(" ");
  for (const item of message) {
    console.log(item);
    if (!item.match(regexes.MENTION) || !item.match(regexes.LINK)) {
      if (!!item.match(regexes.LOWERCASE)) {
        receivedMessage.channel.send(
          `NO TO LECĄ KARNE PUNKCIKI <@${receivedMessage.member.user.id}>`
        );
        const user = await getWixxaUser(receivedMessage.member.user.id);
        user.dataValues.wixxaPoints -= 1;
        await updateWixxaPoints(user);
        return;
      }
    }
  }
  // if (!receivedMessage.content.match(regexes.LINK)){
  // const isLowerCase = (string) => !string.match(/^[A-Z\s\W\d]*$/gm)
  // if(isLowerCase(receivedMessage.content)){

  // console.log(isLowerCase(receivedMessage.content))
  // }
};
