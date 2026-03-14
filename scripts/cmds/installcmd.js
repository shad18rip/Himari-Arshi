const fs = require("fs");

module.exports = {
  config: {
    name: "installcmd",
    version: "1.0",
    author: "Shad",
    role: 2
  },

  onStart: async function ({ message, event }) {

    if (!event.messageReply)
      return message.reply("Reply to command code");

    const code = event.messageReply.body;

    const match = code.match(/name:\s*["'](.*?)["']/);

    if (!match)
      return message.reply("Command name not found");

    const name = match[1];

    fs.writeFileSync(`scripts/cmds/${name}.js`, code);

    message.reply(`✅ Command ${name} installed`);
  }
};
