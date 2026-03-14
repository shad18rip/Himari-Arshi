const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
  config: {
    name: "superinstall",
    version: "2.0",
    author: "Shad",
    role: 2 // admin
  },

  onStart: async function({ message, event }) {

    if (!event.messageReply)
      return message.reply("Reply to the command code or instruction");

    const code = event.messageReply.body;

    // Command detect করার চেষ্টা
    const nameMatch = code.match(/name:\s*["'](.*?)["']/);
    const actionMatch = code.match(/^!superinstall\s+(edit|delete|install)$/i);

    const action = actionMatch ? actionMatch[1].toLowerCase() : "install";

    if (action === "install") {
      if (!nameMatch) return message.reply("Command name not found in code");

      const name = nameMatch[1];
      const path = `scripts/cmds/${name}.js`;

      fs.writeFileSync(path, code);
      message.reply(`✅ Command ${name} installed`);

      // Auto bot restart
      exec("pm2 restart bot || node index.js", (err, stdout, stderr) => {
        if (err) return console.log("Restart error:", err);
        console.log(stdout);
      });

    } else if (action === "edit") {
      if (!nameMatch) return message.reply("Command name not found in code");

      const name = nameMatch[1];
      const path = `scripts/cmds/${name}.js`;

      if (!fs.existsSync(path))
        return message.reply(`❌ Command ${name} not found to edit`);

      fs.writeFileSync(path, code);
      message.reply(`✏️ Command ${name} edited successfully`);

      exec("pm2 restart bot || node index.js", (err) => {});
      
    } else if (action === "delete") {
      if (!nameMatch) return message.reply("Command name not found in code");

      const name = nameMatch[1];
      const path = `scripts/cmds/${name}.js`;

      if (!fs.existsSync(path))
        return message.reply(`❌ Command ${name} not found`);

      fs.unlinkSync(path);
      message.reply(`🗑️ Command ${name} deleted`);

      exec("pm2 restart bot || node index.js", (err) => {});
    }
  }
};
