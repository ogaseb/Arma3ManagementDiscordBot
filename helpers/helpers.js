const regexes = {
  ARGUMENTS: /\b\w*WIXA|ZASADY|RANKING|INIT|HYMN|ID|MUZYKA\w*\b|-?[0-9]\d*(\.\d+)?|"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“|(<[^]*[>$])/gm,
  COMMANDS: /\b\w*WIXA|ZASADY|RANKING|INIT|HYMN|ID|MUZYKA\w*\b/gm,
  CONTENT: /"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“/gm,
  NUMBER: /^(?!.*<@)-?[0-9]\d*(\.\d+)?/gm,
  MENTION: /(<[^]*[>$])/gm,
  EXTRACT_MENTION_ID: /(?<=<@!)(.*)(?=>)/gm,
  LINK: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm,
  LOWERCASE: /^[A-Z-+_!@#$%^&*:.,?ĄĆĘŁŃÓŚŹŻ]*$|(\:(?:\\:|[^:])+:)/gm
};

function filteredRegexes(array) {
  return Object.keys(regexes)
    .filter(key => array.includes(key))
    .reduce((obj, key) => {
      obj[key] = regexes[key];
      return obj;
    }, {});
}

module.exports = {
  regexes,
  filteredRegexes
};
