const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const SlashCommand = require("../../../structures/base/BaseSlashCommand");

class GetUserCommand extends SlashCommand {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client, {
            name: "get-user",
            category: "team",
            guildRequired: true,
            cooldown: 3,
            commandData: {
                description: "Fetch user information from HackRU's database.",
                options: [
                    {
                        name: "email",
                        type: ApplicationCommandOptionType.String,
                        description: "Enter the user's email.",
                        required: true,
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
        const user = await users.findOne({ email: interaction.options.getString("email").toLowerCase() });

        if (!user) return interaction.editReply({ embeds: [this.HackRUBot.util.errorEmbed("No user found with specified email.")] });

        const userEmbed = new EmbedBuilder()
            .setAuthor({ name: "HackRU User Information", iconURL: interaction.guild.iconURL() })
            .setTitle(user.first_name + " " + user.last_name)
            .setDescription(`**Email:** ${user.email}\n**Phone Number:** ${user.phone_number}`)
            .setFields([
                { name: "Status:", value: `\`${user.registration_status}\``, inline: true },
                { name: "Created At:", value: user.created_at ? this.HackRUBot.util.createTimestamp(user.created_at) : "UNDEFINED", inline: true },
                { name: "Registered At:", value: user.registered_at ? this.HackRUBot.util.createTimestamp(user.registered_at) : "UNDEFINED", inline: true },
                { name: "Role(s):", value: Object.entries(user.role).filter(r => r[1] == true).map(r => r[0]).join(", ") || "N/A" },
                { name: "Gender:", value: user.gender, inline: true },
                { name: "Ethnicity:", value: user.ethnicity, inline: true },
                { name: "DOB:", value: user.date_of_birth, inline: true },
                { name: "School:", value: user.school },
                { name: "Major:", value: user.major, inline: true },
                { name: "Grad Year:", value: user.grad_year, inline: true },
                { name: "Study Level:", value: user.level_of_study, inline: true },
                { name: "Votes:", value: user.votes?.toString(), inline: true },
                { name: "Shirt Size:", value: user.shirt_size, inline: true },
                { name: "GitHub:", value: user.github || "UNDEFINED", inline: true },
                { name: "Dietary Restrictions:", value: user.dietary_restrictions || "N/A", inline: true },
                { name: "Special Needs:", value: user.special_needs || "N/A", inline: true },
                { name: "Short Answer:", value: user.short_answer || "UNDEFINED" },
                { name: "Discord:", value: user.discord?.username ? `${user.discord.username} (${user.discord.user_id})` : "Not verified" },
            ])
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        interaction.editReply({ embeds: [userEmbed] });

        return;
    }
}

module.exports = GetUserCommand;