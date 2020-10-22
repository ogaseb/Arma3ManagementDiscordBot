const regexes = {
  ARGUMENTS: /\b\w*parse|mission\w*\b|-?[0-9]\d*(\.\d+)?|"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“|(<[^]*[>$])/gm,
  COMMANDS: /\b\w*parse|mission\w*\b/gm,
  CONTENT: /"(?:\\"|[^"])+"|\'(?:\\'|[^'])+'|\“(?:\\“|[^“])+“/gm,
  NUMBER: /^(?!.*<@)-?[0-9]\d*(\.\d+)?/gm,
  MENTION: /(<[^]*[>$])/gm,
  EXTRACT_MENTION_ID: /(?<=<@!)(.*)(?=>)/gm,
  LINK: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/gm,
  LOWERCASE: /^[A-Z0-9-+_!@#$%^&*;:{}\\/=|()~<>.,?ĄĆĘŁŃÓŚŹŻ\[\]"'`]+$|(\:(.*?)\:)|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm
};

function filteredRegexes(array) {
  return Object.keys(regexes)
    .filter(key => array.includes(key))
    .reduce((obj, key) => {
      obj[key] = regexes[key];
      return obj;
    }, {});
}

function checkIfDM(receivedMessage) {
  return receivedMessage.channel.type === "dm";
}

function validatePermissions(receivedMessage) {
  if (!checkIfDM(receivedMessage)) {
    return !!receivedMessage.member.roles.some(r =>
      process.env.BOT_PERMISSIONS_ROLES.includes(r.name)
    );
  }
}

module.exports = {
  regexes,
  checkIfDM,
  validatePermissions
};
