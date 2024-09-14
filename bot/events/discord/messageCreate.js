const Event = require("../../../structures/base/BaseEvent");
const { EmbedBuilder } = require("discord.js");

class MessageCreateEvent extends Event {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client);
    }

    /**
     * @param {import("discord.js").Message} message 
     * @returns 
     */
    async run(message) {

        if (!message.guild || message.author.bot) return;

        const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${this.HackRUBot.user.id}> |${escapeRegex(this.HackRUBot.config.prefix)})\\s*`);
        const prefix = message.content.match(prefixRegex)?.shift();

        if (!prefix || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = this.HackRUBot.commands.get(args.shift().toLowerCase());

        if (!command) return;

        // ensures the user doesn't get sweeped from the cache for now
        message.member.user.cacheTime = Date.now();

        // command permission checks based on category
        if (command.config.category == "dev" && !this.HackRUBot.config.developers.includes(message.author.id)) return;
        if (command.config.category == "admin" && !this.HackRUBot.config.developers.includes(message.author.id) && !message.member.permissions.has("ManageGuild")) return;
        if (command.config.category == "team" && !this.HackRUBot.config.developers.includes(message.author.id) && !message.member.roles.cache.find(r => r.id == this.HackRUBot.config.teamRoleID)) return;

        // bot requires admin permission to avoid dealing w/ individual role and channel permission checks (may change in the future)
        if (!message.guild.members.me.permissions.has("Administrator"))
            return message.reply({ embeds: [this.HackRUBot.util.errorEmbed("I require `ADMINISTRATOR` permission in this server.")] });

        if (command.config.args && !args.length)
            return message.reply({ embeds: [this.HackRUBot.util.errorEmbed("This command requires arguments. Use `help [command]` to see the proper command usage.")] });

        if (this.HackRUBot.util.handleCooldown(command, message)) return;

        command.run(message, args).catch(err => {
            console.error(`-----\nCOMMAND (${command.config.name}) ERROR | EXECUTOR: ${message.author.username} | GUILD: ${message.guild.name} |\n` + err.stack + "\n-----");

            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: `Command Error: ${command.config.name}`, iconURL: this.HackRUBot.user.displayAvatarURL() })
                .setColor("Red")
                .addFields([
                    { name: "Executor", value: message.author.username, inline: true },
                    { name: "Channel / Guild", value: message.channel.name + " / " + message.guild.name, inline: true },
                    { name: "Message Content", value: message.content },
                ])
                .setDescription(err.stack.length < 4000 ? err.stack : err.stack.substring(0, 4000))
                .setFooter({ text: this.HackRUBot.user.tag })
                .setTimestamp();

            this.HackRUBot.logs.send({ embeds: [errorEmbed] });

            message.reply({ embeds: [this.HackRUBot.util.errorEmbed("An internal error has occurred. Developers have been notified. Please contact staff for further assistance.")] });
        });

        return;

    }

}

module.exports = MessageCreateEvent;