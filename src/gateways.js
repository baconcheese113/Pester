import quotes from "./existentialism";
import { stripEmojis, stripSpaces, breakIntoMsgChunks } from "./util";
import horrorQuips from "./horror";
import MESSAGE_TO_SEND from "./message";

export default class Gateways {
  constructor(client) {
    this.client = client;
  }

  registerListeners() {
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on("message", async msg => {
      if (msg.content === "!burp") {
        console.log(msg);
        const res = quotes[Math.floor(Math.random() * (quotes.length - 1))];
        console.log(res);
        msg.reply(res);
      }
    });
    this.client.on("message", msg => {
      if (msg.content.startsWith("!burp whosnot ") && msg.member.hasPermission("ADMINISTRATOR")) {
        const rawListStr = msg.content.split("!burp whosnot ")[1];
        const rawList = rawListStr.split("\n");
        const cleanList = rawList.map(v => stripSpaces(stripEmojis(v.toLowerCase())));

        const members = msg.guild.members;
        console.log(`searching through ${members.array().length} members`);
        const membersStr = members.reduce((str, m) => {
          if (!m.user) return str;
          const username = stripSpaces(stripEmojis(m.user.username.toLowerCase()));
          const inList = cleanList.some(v => {
            const match = v === username || v === `${username}#${m.user.discriminator}`;
            if (match) console.log(`${v} matched to ${username}`);
            return match;
          });
          if (!inList) console.log(`No match found for ${username}`);
          return inList ? str : `${str} ${m.user.username}#${m.user.discriminator}\n`;
        }, "");
        const memberChunks = breakIntoMsgChunks(membersStr);
        memberChunks.forEach(chunk => {
          msg.author.send(chunk);
        });
        msg.reply("Sent you nudes 🌚");
      }
    });

    this.client.on("message", async msg => {
      if (msg.content.startsWith("!burp tickleallbut ") && msg.member.hasPermission("ADMINISTRATOR")) {
        const rawListStr = msg.content.split("!burp tickleallbut ")[1];
        const rawList = rawListStr.split("\n");
        const cleanList = rawList.map(v => stripSpaces(stripEmojis(v.toLowerCase())));

        const members = msg.guild.members;
        // Send PMs to everyone not in the list
        for (const [id, m] of members) {
          try {
            if (!m.user || m.user.bot) continue;
            const username = stripSpaces(stripEmojis(m.user.username.toLowerCase()));
            const inList = cleanList.some(v => {
              const match = v === username || v === `${username}#${m.user.discriminator}`;
              if (match) console.log(`${v} matched to ${username}`);
              return match;
            });
            if (!inList) {
              await m.send(MESSAGE_TO_SEND);
              console.log(`No match found for ${username}`);
            }
          } catch (err) {
            console.error(err);
          }
        }
        msg.reply(horrorQuips[Math.floor(Math.random() * (horrorQuips.length - 1))]);
      }
    });

    this.client.on("messageUpdate", (oldMsg, newMsg) => {
      // if (oldMsg.content !== newMsg.content) {
      //   newMsg.reply(`Lets get it right the first time`);
      // }
    });
  }
}
