const { MessageEmbed } = require("discord.js");
const { Embeds } = require("discord-paginationembed");

module.exports.sendHelp = function(receivedMessage, destination) {
  const embeds = [];

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```parse```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
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
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```mission - dzięki tej komendzie możecie wrzucić misje bezpośrednio z discorda na serwer. Pamiętajcie żeby plik miał rozszerzenie .pbo. Komende wpisujecie jako komentarz do pliku```"
      )
      .addField("Komenda: ", "```" + "$mission```")
      .addField("Przykład: ", "```" + "$mission (jako komentarz do pliku)```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```get-missions```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```get-missions - wyświetla liste wszystkich misji wrzuconych na serwer```"
      )
      .addField("Komenda: ", "```" + "$get-missions```")
      .addField("Przykład: ", "```" + "$get-missions```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```set-mission```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```set-mission - komenda do uruchomienia konkretnej misji na serwerze z poziomu discorda```"
      )
      .addField("Komenda: ", "```" + '$set-mission "<nazwa misji>"```')
      .addField("Przykład: ", "```" + '$set-mission "misja.Altis"```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```reassign```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```reassign - zacznij misje od początku, wyrzuca wszystkich z powrotem do menu wybierania ról```"
      )
      .addField("Komenda: ", "```" + "$reassign```")
      .addField("Przykład: ", "```" + "$reassign```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```say```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```say - dzięki tej komendzie możesz przekazać jakąś informacje graczom na serwerze, nawet nie wchodząc na niego```"
      )
      .addField("Komenda: ", "```" + '$say "<wiadomosc>"```')
      .addField("Przykład: ", "```" + '$say "testowa wiadomość"```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```players```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999646040522763>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```players - komenda ta wyświetla liste graczy aktualnie znajdującym się na serwerze, służy on znalezieniu odpowiedniego id (#) gracza do skickowania/zbanowania```"
      )
      .addField("Komenda: ", "```" + "$players```")
      .addField("Przykład: ", "```" + "$players```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```kick```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```kick - komenda do kickowania użytkownika z serwera```"
      )
      .addField("Komenda: ", "```" + '$kick "<powód>" <id>```')
      .addField("Przykład: ", "```" + '$kick "złe zachowanie" 0```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```ban```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```ban - komenda do zbanowania użytkownika z serwera```"
      )
      .addField("Komenda: ", "```" + '$ban "<powód>" <id> <czas w minutach>```')
      .addField("Przykład: ", "```" + '$ban "złe zachowanie" 0 60```')
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```get-bans```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
        "```get-bans - zwraca liste wszystkich zbanowanych graczy numerek pod (#) służy do odbanowania```"
      )
      .addField("Komenda: ", "```" + "$get-bans```")
      .addField("Przykład: ", "```" + "$get-bans```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```remove-ban```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999606987227157>```"
      )
      .addField("Opis", "```remove-ban - usuwa gracza z listy zbanowanych```")
      .addField("Komenda: ", "```" + "$remove-ban <id>```")
      .addField("Przykład: ", "```" + "$remove-ban 0```")
  );

  embeds.push(
    new MessageEmbed()
      .addField("**KOMENDA**: ", "```restart-server```")
      .addField(
        "dostęp",
        "```<@&753733954737274980>, <@&753999606987227157>```"
      )
      .addField(
        "Opis",
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
      .setDescription(
        "**WAŻNE!!!** \n\n jeśli w danej komendzie w przykładzie pokazane są cudzysłowy należy zawrzeć wiadomość własnie w nich! Inaczej komenda nie zadziała! \n"
      )
      .setTimeout(600000)
      .setDeleteOnTimeout(true)
  );
};
