import quotes from "./existentialism";
import { stripEmojis, stripSpaces, breakIntoMsgChunks, getDiscriminator } from "./util";
import horrorQuips from "./horror";
import getMessage from "./message";

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
    this.client.on("message", async msg => {
      if (msg.content.startsWith("!burp whosnot ") && msg.member.hasPermission("ADMINISTRATOR")) {
        const rawListStr = msg.content.split("!burp whosnot ")[1];
        const rawList = rawListStr.split("\n");
        const cleanList = rawList.map(v => stripSpaces(stripEmojis(v.toLowerCase())));

        const members = await msg.guild.members.fetch();
        console.log(`searching through ${members.array().length} members`);
        const membersStr = members.reduce((str, m) => {
          if (!m.user) return str;
          const username = stripSpaces(stripEmojis(m.user.username.toLowerCase()));
          const inList = cleanList.some(v => {
            const match =
              v === username ||
              v === `${username}#${m.user.discriminator}` ||
              getDiscriminator(v) === m.user.discriminator;
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

        const members = await msg.guild.members.fetch();
        // Send PMs to everyone not in the list
        for (const [id, m] of members) {
          try {
            if (!m.user || m.user.bot) continue;
            const username = stripSpaces(stripEmojis(m.user.username.toLowerCase()));
            const inList = cleanList.some(v => {
              const match =
                v === username ||
                v === `${username}#${m.user.discriminator}` ||
                getDiscriminator(v) === m.user.discriminator;
              if (match) console.log(`${v} matched to ${username}`);
              return match;
            });
            if (!inList) {
              await m.send(getMessage(username));
              console.log(`No match found for ${username}`);
            }
          } catch (err) {
            console.error(err, `Can't send to ${m.user.username}`);
          }
        }
        msg.reply(horrorQuips[Math.floor(Math.random() * (horrorQuips.length - 1))]);
      }
    });

    this.client.on("message", async msg => {
      if (msg.content.startsWith("!burp whodidntreact ") && msg.member.hasPermission("ADMINISTRATOR")) {
        const messageId = msg.content.split("!burp whodidntreact ")[1];

        // Find message from Id
        const messageReactions = await msg.guild.channels.cache.reduce(async (prevPromise, channel) => {
          const prev = await prevPromise;
          if (prev || channel.type !== "text") return prev;
          try {
            const foundMsg = await channel.messages.fetch(messageId);
            console.log(`Found in ${channel.name}`);
            return foundMsg.reactions.cache;
          } catch {}
          return;
        }, null);

        // Get and merge collection of users who have reacted
        const reactedUsersColl = await messageReactions.reduce(async (accUsersCollPromise, messageReaction) => {
          const accUsersColl = await accUsersCollPromise;
          const users = await messageReaction.users.fetch();
          if (accUsersColl) return accUsersColl.concat(users);
          return users;
        }, null);

        // Send PMs to everyone who hasn't reacted
        const members = await msg.guild.members.fetch();
        for (const [id, m] of members) {
          try {
            if (!m.user || m.user.bot) continue;
            const inList = reactedUsersColl.has(m.user.id);
            const username = m.user.username;
            if (!inList) {
              await m.send(getMessage(username));
              console.log(`No match found for ${username}`);
            } else {
              console.log(`${username} reacted`);
            }
          } catch (err) {
            console.error(err, `Can't send to ${m.user.username}`);
          }
        }
        msg.reply(horrorQuips[Math.floor(Math.random() * (horrorQuips.length - 1))]);
      }
    });

    this.client.on("message", async msg => {
      if (msg.content.startsWith("!burp tickletheunverified") && msg.member.hasPermission("ADMINISTRATOR")) {

        let verifiedCount = 0
        let unverifiedCount = 0
        // Go through all users 
        const members = await msg.guild.members.fetch();
        for (const [id, m] of members) {
          try {
            // If they haven't verified send message
            if (!m.user || m.user.bot) continue;
            const username = m.user.username;
            const isVerified = m.cache.roles.cache.some(role => role.id === '651635493452251146') // specific role id to check for
            if (!isVerified) {
              unverifiedCount++
              await m.send(getMessage(username));
              console.log(`This user has yet to verify - ${username}`);
            } else {
              verifiedCount++
              console.log(`${username} verified`);
            }
          } catch (err) {
            console.error(err, `Can't send to ${m.user.username}`);
          }
        }
        msg.reply(`${verifiedCount} verified AND ${unverifiedCount} unverified`);
      }
    });

    this.client.on("messageUpdate", (oldMsg, newMsg) => {
      // if (oldMsg.content !== newMsg.content) {
      //   newMsg.reply(`Lets get it right the first time`);
      // }
    });
  }
}
