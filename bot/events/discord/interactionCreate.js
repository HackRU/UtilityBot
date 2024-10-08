const Event = require("../../../structures/base/BaseEvent");
const { EmbedBuilder } = require("discord.js");

class InteractionCreateEvent extends Event {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client);
    }

    /**
     * @param {import("discord.js").Interaction} interaction 
     * @returns 
     */
    async run(interaction) {

        if (interaction.user.bot) return;

        const command = this.HackRUBot.slashCommands.get(interaction.commandName) ?? this.HackRUBot.components.get(interaction.customId);
        if (!command) return;

        if (command.config.guildRequired && !interaction.guild)
            return interaction.reply({ embeds: [this.HackRUBot.util.errorEmbed("This command must be used in a server.")] });

        // ensures the user doesn't get sweeped from the cache for now
        if (interaction.member) interaction.member.user.cacheTime = Date.now();
        else interaction.user.cacheTime = Date.now();

        // command permission checks based on category
        if (command.config.category == "dev" && !this.HackRUBot.config.developers.includes(interaction.user.id))
            return interaction.reply({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("This command can only be used by developers.")] });
        if (command.config.category == "admin" && !this.HackRUBot.config.developers.includes(interaction.user.id) && !interaction.member.permissions.has("ManageGuild"))
            return interaction.reply({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("This command can only be used by administrators.")] });
        if (command.config.category == "team" && !this.HackRUBot.config.developers.includes(interaction.user.id) && !interaction.member.roles.cache.find(r => r.id == this.HackRUBot.config.teamRoleID))
            return interaction.reply({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("This command can only be used by authorized HackRU team members.")] });

        // bot requires admin permission to avoid dealing w/ individual role and channel permission checks (may change in the future)
        if (!interaction.guild.members.me.permissions.has("Administrator"))
            return interaction.reply({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("I require `ADMINISTRATOR` permission in this server.")] }).catch(() => { });

        if (this.HackRUBot.util.handleCooldown(command, interaction)) return;

        command.run(interaction).catch(err => {
            console.error(`-----\nINTERACTION (${command.config.name}) ERROR | EXECUTOR: ${interaction.user.username} | GUILD: ${interaction.guild?.name || "N/A"} |\n INTERACTION DATA: ${interaction.options?.data ? JSON.stringify(interaction.options.data) : "N/A"} |\n` + err.stack + "\n-----");

            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: `Interaction Error: ${command.config.name}`, iconURL: this.HackRUBot.user.displayAvatarURL() })
                .setColor("Red")
                .addFields([
                    { name: "Executor", value: interaction.user.username, inline: true },
                    { name: "Channel / Guild", value: interaction.channel?.name + " / " + interaction.guild?.name, inline: true },
                    { name: "Interaction Data", value: interaction.options?.data ? JSON.stringify(interaction.options.data) : "N/A" },
                ])
                .setDescription(err.stack.length < 4000 ? err.stack : err.stack.substring(0, 4000))
                .setFooter({ text: this.HackRUBot.user.tag })
                .setTimestamp();

            this.HackRUBot.logs.send({ embeds: [errorEmbed] });

            if (!interaction.deferred && !interaction.replied) interaction.reply({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("An internal error has occurred. Developers have been notified. Please contact staff for further assistance.")] });
            else interaction.followUp({ ephemeral: true, embeds: [this.HackRUBot.util.errorEmbed("An internal error has occurred. Developers have been notified. Please contact staff for further assistance.")] });
        });

        return;

    }

}

module.exports = InteractionCreateEvent;