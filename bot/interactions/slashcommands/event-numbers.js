const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../../structures/base/BaseSlashCommand");

class EventNumbersCommand extends SlashCommand {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client, {
            name: "event-numbers",
            category: "team",
            guildRequired: true,
            cooldown: 3,
            commandData: {
                description: "Fetch event attendance data from HackRU's database.",
            },
        });
    }

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async run(interaction) {
        await interaction.deferReply();

        const users = await this.HackRUBot.db.getCollection("users");

        const events = [
            "lunch-saturday",
            "dinner-saturday",
            "github-copilot",
            "figma-workshop",
            "wakefern-coffee-chat",
            "wakefern-cafe",
            "midnight-surpise",
            "icims-tech-talk",
            "breakfast-sunday",
            "lunch-sunday",
        ];

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: "HackRU Events Attendance", iconURL: interaction.guild.iconURL() })
            .setDescription("Count of checked in users who attended events. Duplicates are not counted.")
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        for (const event of events) {
            const count = await users.countDocuments({ registration_status: "checked_in", [`day_of.event.${event}.attend`]: { $gte: 1 } });
            infoEmbed.addFields({ name: event, value: `\`${count}\``, inline: true });
        }

        interaction.editReply({ embeds: [infoEmbed] });

        return;
    }
}

module.exports = EventNumbersCommand;