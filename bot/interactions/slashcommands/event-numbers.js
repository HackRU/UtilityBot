const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
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
                options: [
                    {
                        name: "event-name",
                        type: ApplicationCommandOptionType.String,
                        description: "Enter the database name of the event to get attendance.",
                        required: false,
                    },
                ],
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
            "f-26 lunch-saturday",
            "f-26 dinner-saturday",
            "f-26 breakfast-sunday",
            "f-26 lunch-sunday",
            "f-26 midnight-surprise",
            "f-26 Rutgers RES Adobe Workshop",
            "f-26 MLH Workshop"
        ];

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: "HackRU Events Attendance", iconURL: interaction.guild.iconURL() })
            .setDescription("Total and unique event attendance counts for the current season. For an event not listed here, specify the `event-name` option in command.")
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        if (!interaction.options.getString("event-name", false)) {
            for (const event of events) {
                const [result] = await users.aggregate([
                    { $match: { registration_status: "checked_in", [`day_of.event.${event}.attend`]: { $gte: 1 } } },
                    { $group: { _id: null, total: { $sum: `$day_of.event.${event}.attend` }, unique: { $sum: 1 } } },
                ]).toArray();
                infoEmbed.addFields({ name: event, value: `Total: \`${result?.total ?? 0}\`\nUnique: \`${result?.unique ?? 0}\``, inline: true });
            }
        } else {
            const event = interaction.options.getString("event-name");
            const [result] = await users.aggregate([
                { $match: { registration_status: "checked_in", [`day_of.event.${event}.attend`]: { $gte: 1 } } },
                { $group: { _id: null, total: { $sum: `$day_of.event.${event}.attend` }, unique: { $sum: 1 } } },
            ]).toArray();
            infoEmbed.addFields({ name: event, value: `Total: \`${result?.total ?? 0}\`\nUnique: \`${result?.unique ?? 0}\`` });
        }

        interaction.editReply({ embeds: [infoEmbed] });

        return;
    }
}

module.exports = EventNumbersCommand;
