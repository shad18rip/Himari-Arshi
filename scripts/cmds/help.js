const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "Ktkhang | modified by Shad",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "help <command name>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // ================= ALL COMMAND LIST =================
    if (args.length === 0) {
      const categories = {};
      let msg = "";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────⭓ ${category.toUpperCase()}`;

          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 2) {
            const cmds = names.slice(i, i + 2).map((item) => `✧${item}`);
            msg += `\n│${cmds.join("     ")}`;
          }

          msg += `\n╰────────────⭓\n`;
        }
      });

      const totalCommands = commands.size;

      msg += `\n⭔Bot has ${totalCommands} commands`;
      msg += `\n⭔Type ${prefix}𝐡𝐞𝐥𝐩 <𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚗𝚊𝚖𝚎> to learn Usage.\n`;

      msg += `
╭─✦ADMIN: Shad
├‣ FACEBOOK
╰‣: fb.com/100092296102424
`;

      try {
        const sent = await message.reply({ body: msg });

        setTimeout(() => {
          message.unsend(sent.messageID);
        }, 80000);

      } catch (err) {
        console.error("Help error:", err);
      }

    // ================= SINGLE COMMAND INFO =================
    } else {
      const commandName = args[0].toLowerCase();
      const command =
        commands.get(commandName) ||
        commands.get(aliases.get(commandName));

      if (!command) {
        return message.reply(`❌ Command "${commandName}" not found.`);
      }

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const longDescription =
        configCommand.longDescription?.en || "No description";

      const guideBody = configCommand.guide?.en || "No guide available.";
      const usage = guideBody
        .replace(/{he}/g, prefix)
        .replace(/{lp}/g, configCommand.name);

      const response = `╭─────────⭓
│ 🎀 NAME: ${configCommand.name}
│ 📃 Aliases: ${
        configCommand.aliases
          ? configCommand.aliases.join(", ")
          : "Do not have"
      }
├──‣ INFO
│ 📝 Description: ${longDescription}
│ 👑 Admin: Shad
│ 📚 Guide: ${usage}
├──‣ Usage
│ ⭐ Version: ${configCommand.version || "1.0"}
│ ♻️ Role: ${roleText}
╰────────────⭓`;

      const sent = await message.reply(response);

      setTimeout(() => {
        message.unsend(sent.messageID);
      }, 80000);
    }
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Bot admin)";
    default:
      return "Unknown role";
  }
}
