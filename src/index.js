import Discord from 'discord.js'
const client = new Discord.Client();
import auth from "../auth.json"; 
import Gateways from "./gateways";

const gateways = new Gateways(client);
gateways.registerListeners();

client.login(auth.token);
