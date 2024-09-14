const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../../structures/base/BaseSlashCommand");

class RegistrationNumbersCommand extends SlashCommand {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client, {
            name: "registration-numbers",
            category: "team",
            guildRequired: true,
            cooldown: 3,
            commandData: {
                description: "Fetch registration data from HackRU's database.",
            },
        });
    }

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async run(interaction) {
        await interaction.deferReply();

        const users = await this.HackRUBot.db.getCollection("users");

        const unregistered = await users.countDocuments({ registration_status: "unregistered", created_at: { $gt: "2024-08-28" } });
        const registered = await users.countDocuments({ registration_status: "registered" });
        const confirmation = await users.countDocuments({ registration_status: "confirmation" });
        const rejected = await users.countDocuments({ registration_status: "rejected" });
        const coming = await users.countDocuments({ registration_status: "coming" });
        const notComing = await users.countDocuments({ registration_status: "not_coming" });
        const confirmed = await users.countDocuments({ registration_status: "confirmed" });
        const waitlist = await users.countDocuments({ registration_status: "waitlist" });
        const checkedIn = await users.countDocuments({ registration_status: "checked_in" });

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: "HackRU Registration Information", iconURL: interaction.guild.iconURL() })
            .setFields([
                { name: "Unregistered:", value: `\`${unregistered}\``, inline: true },
                { name: "Registered:", value: `\`${registered}\``, inline: true },
                { name: "Confirmation:", value: `\`${confirmation}\``, inline: true },
                { name: "Rejected:", value: `\`${rejected}\``, inline: true },
                { name: "Coming:", value: `\`${coming}\``, inline: true },
                { name: "Not Coming:", value: `\`${notComing}\``, inline: true },
                { name: "Confirmed:", value: `\`${confirmed}\``, inline: true },
                { name: "Waitlist:", value: `\`${waitlist}\``, inline: true },
                { name: "Checked In:", value: `\`${checkedIn}\``, inline: true },
            ])
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        interaction.editReply({ embeds: [infoEmbed] });

        return;
    }
}

module.exports = RegistrationNumbersCommand;