const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("../auth.json");
// const Gateways = require("./gateways.js");
import Gateways from "./gateways";

const gateways = new Gateways(client);
gateways.registerListeners();

client.login(auth.token);
