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
            "f-25 breakfast-sunday",
            "f-25 lunch-sunday-real",
            "rad-workshop",
            "idea-workshop",
            "wakefern-coffee-chat",
            "wakefern-cafe",
            "midnight-surprise",
            "mlh-workshops",
            "f-25 lunch-saturday",
            "f-25 dinner-saturday",
        ];

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: "HackRU Events Attendance", iconURL: interaction.guild.iconURL() })
            .setDescription("Count of checked in users who attended events. Duplicates are not counted. For an event not listed here, specify the `event-name` option in command.")
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        if (!interaction.options.getString("event-name", false)) {
            for (const event of events) {
                const count = await users.countDocuments({ registration_status: "checked_in", [`day_of.event.${event}.attend`]: { $gte: 1 } });
                infoEmbed.addFields({ name: event, value: `\`${count}\``, inline: true });
            }
        } else {
            const event = interaction.options.getString("event-name");
            const count = await users.countDocuments({ registration_status: "checked_in", [`day_of.event.${event}.attend`]: { $gte: 1 } });
            infoEmbed.addFields({ name: event, value: `\`${count}\`` });
        }

        interaction.editReply({ embeds: [infoEmbed] });

        return;
    }
}

module.exports = EventNumbersCommand;
