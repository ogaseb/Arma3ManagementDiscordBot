const { MessageEmbed } = require("discord.js");
const { Embeds } = require("discord-paginationembed");

module.exports.sendHelp = function(receivedMessage, destination) {
  const embeds = [];

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```parse```")
      .addField(
        "Opis",
        "```parse -  Służy do parsowania waszych presetów z modami na liste modów, którą potem wrzucam na serwer żeby wiedział które ma sobie załadować```"
      )
      .addField("Komenda: ", "```$parse```")
      .addField("Przykład: ", "```$parse (jako komentarz do pliku)```")
  );
  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```mission```")
      .addField(
        "Description",
        "```mission - dzięki tej komendzie możecie wrzucić misje bezpośrednio z discorda na serwer. Pamiętajcie żeby plik miał rozszerzenie .pbo. Komende wpisujecie jako komentarz do pliku```"
      )
      .addField("Komenda: ", "```" + "$mission```")
      .addField("Przykład: ", "```" + "$mission (jako komentarz do pliku)```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```get-missions```")
      .addField(
        "Description",
        "```get-missions - wyświetla liste wszystkich misji wrzuconych na serwer```"
      )
      .addField("Komenda: ", "```" + "$get-missions```")
      .addField("Przykład: ", "```" + "$get-missions```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```set-mission```")
      .addField(
        "Description",
        "```set-mission - komenda do uruchomienia konkretnej misji```"
      )
      .addField("Komenda: ", "```" + '$set-mission "<nazwa misji>"```')
      .addField("Przykład: ", "```" + '$set-mission "misja.Altis"```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```say```")
      .addField(
        "Description",
        "```say - dzięki tej komendzie możesz przekazać jakąś informacje graczom na serwerze, nie będąc na nim```"
      )
      .addField("Komenda: ", "```" + '$say "<wiadomosc>"```')
      .addField("Przykład: ", "```" + '$say "testowa wiadomość"```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```players```")
      .addField(
        "Description",
        "```players - komenda ta wyświetla liste graczy aktualnie znajdującym się na serwerze, służy on znalezieniu odpowiedniego id (#) gracza do skickowania/zbanowania```"
      )
      .addField("Komenda: ", "```" + "$players```")
      .addField("Przykład: ", "```" + "$players```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```kick```")
      .addField(
        "Description",
        "```kick - komenda do kickowania użytkownika z serwera```"
      )
      .addField("Komenda: ", "```" + '$kick "<powód>" <id>```')
      .addField("Przykład: ", "```" + '$kick "złe zachowanie" 0```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```restart-server```")
      .addField(
        "Description",
        "```restart-server - wiadomo po co, w celu zrestartowania serwera```"
      )
      .addField("Komenda: ", "```" + "$restart-server```")
      .addField("Przykład: ", "```" + "$restart-server```")
  );

  return (
    new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([receivedMessage.author.id])
      .setChannel(
        destination === "pm" ? receivedMessage.author : receivedMessage.channel
      )
      .setPageIndicator(true)
      .setPage(1)
      // Methods below are for customising all embeds
      .setTitle("Pomoc WorldTensionBot")
      .setDescription(
        "=========================================================="
      )
      .setFooter("")
      .setColor(0xffffff)
      .setNavigationEmojis({
        back: "◀",
        jump: "↗",
        forward: "▶",
        delete: "🗑"
      })
      .setTimeout(600000)
      .setDeleteOnTimeout(true)
  );
};
