require("dotenv").config();
const { Client } = require("discord.js");
const { orderBy } = require("lodash");
const { getHours, getMinutes } = require("date-fns");
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

  const statusArray = [
    { status: "ROBIENIE WIXXY", type: "GAMING" },
    { status: "ULANE KURWY", type: "STREAMING" },
    { status: "PATOSTREAM KOCIOŁ PANORAMIKSA", type: "WATCHING" }
  ];

  const mobbynArray = [
    "https://www.youtube.com/watch?v=baRjEiOD2_c",
    "https://www.youtube.com/watch?v=rzpQoVG0qD4",
    "https://www.youtube.com/watch?v=k150Ukps3mw",
    "https://www.youtube.com/watch?v=dPdY28i9uUQ",
    "https://www.youtube.com/watch?v=9uQmkD6SDQg",
    "https://www.youtube.com/watch?v=A-pXUdsLSiI",
    "https://www.youtube.com/watch?v=TgbVLEAy5ZI",
    "https://www.youtube.com/watch?v=NX6qzgGyzEk",
    "https://www.youtube.com/watch?v=CybamrlUjj4",
    "https://www.youtube.com/watch?v=-pUvSOJry2I",
    "https://www.youtube.com/watch?v=olE0KiPA-cg",
    "https://www.youtube.com/watch?v=hydilZqltYA",
    "https://www.youtube.com/watch?v=TQSS91JvVqc",
    "https://www.youtube.com/watch?v=QHzl5Ij-Qn4",
    "https://www.youtube.com/watch?v=PpQjv0sPWWU",
    "https://www.youtube.com/watch?v=zAumHfTp6jQ",
    "https://www.youtube.com/watch?v=HfVr3uZ0BZw",
    "https://www.youtube.com/watch?v=YLZbfDevomg",
    "https://www.youtube.com/watch?v=5x4Kk_1X_3U",
    "https://www.youtube.com/watch?v=-0QiCWGmBcw",
    "https://www.youtube.com/watch?v=miwyMVT_zU0",
    "https://www.youtube.com/watch?v=m-w9MrIbLpg",
    "https://www.youtube.com/watch?v=82cgNJBu_Jk",
    "https://www.youtube.com/watch?v=OWa5TNYc4bY",
    "https://www.youtube.com/watch?v=DpUtcNiMe40",
    "https://www.youtube.com/watch?v=DLfvaysoZj8",
    "https://www.youtube.com/watch?v=WO5MCOvty9U",
    "https://www.youtube.com/watch?v=2Yy9RP6HQh0",
    "https://www.youtube.com/watch?v=OjWFxcEIgUQ"
  ];

  console.log(getHours(new Date()), getMinutes(new Date()));

  setInterval(async () => {
    const randomNumber = Math.floor(Math.random() * statusArray.length);
    await client.user.setActivity(statusArray[randomNumber].status, {
      type: statusArray[randomNumber].type
    });

    if (getHours(new Date()) === 18 && getMinutes(new Date()) === 0) {
      await client.channels
        .get(process.env.CHANNEL_ID)
        .send(
          `@everyone ELO DZISIAJ W MLYNNIE GRAMY ${
            mobbynArray[Math.floor(Math.random() * mobbynArray.length)]
          }`
        );
    }
    console.log("ping");
  }, 1000 * 60);
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
  const role = guild.roles.get(process.env.USER_ROLE_ID);
  const user = role.members.get(receivedMessage.user.id);
  console.log(user);
  if (user && user.roles.has(process.env.USER_ROLE_ID)) {
    const obj = {
      discordId: user.id,
      name: receivedMessage.user.username,
      wixxaPoints: 0
    };

    const helloArray = [
      "SIEMANO KURWA",
      "USIĄDŹ I DUPNIJ SE LOLKA CZŁOWIEKU",
      "KORZYSTAJ Z MŁYNU MĄDRZE",
      "SKOSZTUJ WIXY",
      "NO ELO"
    ];
    await addWixxaUser(obj);
    await client.channels
      .get(process.env.CHANNEL_ID)
      .send(
        `${helloArray[Math.floor(Math.random() * helloArray.length)]} <@${
          receivedMessage.user.id
        }>`
      );
  }
});

const processCommand = async receivedMessage => {
  let fullCommand, primaryCommand;

  fullCommand = receivedMessage.content.substr(1);
  if (!fullCommand) {
    receivedMessage.channel.send(`EJ TYPIE O CO CI CHODZI, WYJEBAC CI???`);
  }

  const messageArguments = fullCommand.match(regexes.ARGUMENTS);

  if (messageArguments !== null && messageArguments.length) {
    primaryCommand = messageArguments[0]; // The first word directly after the exclamation is the command
    messageArguments.splice(0, 1);
  }

  if (primaryCommand === "INIT") {
    const guildMembers = client.guilds.get(process.env.GUILD_ID).members;
    let wixxaMembers = [];
    Array.from(guildMembers, ([key, member]) => {
      Array.from(member.roles, ([key, role]) => {
        if (process.env.BOT_PERMISSIONS_USERS.includes(role.id)) {
          wixxaMembers.push(member);
        }
      });
    });
    console.log(wixxaMembers);

    // const members = guild.roles.get(process.env.USER_ROLE_ID).members;
    wixxaMembers.forEach(member => {
      const obj = {
        discordId: member.user.id,
        name: member.user.username,
        wixxaPoints: 0
      };
      addWixxaUser(obj);
    });
    console.log("done");
    return;
  }

  if (primaryCommand === "RANKING") {
    const users = await getAllWixxaUsers();
    let usersArray = [];
    users.forEach(user => {
      usersArray.push(user.dataValues);
    });

    const result = orderBy(usersArray, ["wixxaPoints"], ["desc"]);

    let responseString = ``;
    result.forEach((item, index) => {
      if (index === 0) {
        responseString += `\`\`\`RANKING\n`;
      }
      responseString += `${index + 1}. ${item.name}: ${
        item.wixxaPoints
      } PUNKTÓW MŁYNNU \n`;
    });
    return receivedMessage.channel.send(responseString + `\`\`\``);
  }

  if (primaryCommand === "ZASADY") {
    return receivedMessage.channel.send(
      `\`\`\`TO JEST MŁYN\nPOZWÓL ZE PRZEDSTAWIĘ ZASADY:\n1. PISZEMY TYLKO CAPSEM\n2. SZYDZIMY ZE WSZYSTKIEGO I WSZYSTKICH \n3. ODPIERDALANY JAKIŚ SZAJS CHUJ WIE PO CO\n4. WSZYSTKO CO JEST NA MŁYNIE ZOSTAJE NA MŁYNIE \n\nUWAGA!!!\nMOBBYN, HEWERKA, TEDZIK I INNE CYTATY MILE WIDZIANE\`\`\``
    );
  }

  if (primaryCommand === "HYMN") {
    return receivedMessage.channel.send(
      `https://www.youtube.com/watch?v=baRjEiOD2_c`
    );
  }

  if (
    primaryCommand === "ID" &&
    receivedMessage.channel.id === process.env.ADMIN_CHANNEL_ID
  ) {
    const members = receivedMessage.channel.guild.roles.get(
      "646815756188909598"
    ).members;

    let sendString = ``;
    for (const role of members) {
      sendString += `${role[1].user.username} - ${role[1].user.id}\n`;
    }

    receivedMessage.channel.send(`\`\`\`${sendString}\`\`\``);
  }

  if (
    primaryCommand === "WIXA" &&
    receivedMessage.channel.id === process.env.ADMIN_CHANNEL_ID
  ) {
    try {
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
      const user = await getWixxaUser(discordId);
      user.dataValues.wixxaPoints += parseInt(foundArgsObj.NUMBER);
      const newUser = await updateWixxaPoints(user);
      return client.channels
        .get(process.env.CHANNEL_ID)
        .send(
          `${foundArgsObj.MENTION} OTRZYMUJESZ ${
            foundArgsObj.NUMBER < 0 ? `KARNE` : `BONUSOWE`
          } PUNKTY MLYNNU W ILOŚCI \`${foundArgsObj.NUMBER}\` ZA ${
            foundArgsObj.CONTENT
          } W SUMIE TO MASZ ICH JUŻ \`${newUser[1][0].dataValues.wixxaPoints}\``
        );
    } catch (e) {
      console.log(e);
    }
  }
};

const processText = async receivedMessage => {
  const message = receivedMessage.content.split(" ");
  for (const item of message) {
    if (!item.match(regexes.MENTION) || !item.match(regexes.LINK)) {
      if (!!item.match(regexes.LOWERCASE)) {
        receivedMessage.channel.send(
          `NO TO LECĄ KARNE PUNKTY MLYNNU <@${receivedMessage.member.user.id}> REGULAMIN SIE KLANIA`
        );
        const user = await getWixxaUser(receivedMessage.member.user.id);
        user.dataValues.wixxaPoints -= 1;
        await updateWixxaPoints(user);
        return;
      }
    }
  }
};
