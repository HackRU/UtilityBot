const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const SlashCommand = require("../../../structures/base/BaseSlashCommand");

class SearchUserCommand extends SlashCommand {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client, {
            name: "search-user",
            category: "team",
            guildRequired: true,
            cooldown: 3,
            commandData: {
                description: "Search for users from HackRU's database.",
                options: [
                    {
                        name: "text",
                        type: ApplicationCommandOptionType.String,
                        description: "Enter text to search HackRU's user database.",
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
        const search = users.find({ $text: { $search: interaction.options.getString("text") } }, { projection: { first_name: 1, last_name: 1, email: 1 } });
        let results = await search.toArray();

        if (!results.length) return interaction.editReply({ embeds: [this.HackRUBot.util.errorEmbed("No user found with the specified search.")] });

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: `HackRU Users Search - ${results.length} results found`, iconURL: interaction.guild.iconURL() })
            .setColor("Blurple")
            .setFooter({ text: "Data as of" })
            .setTimestamp();

        results = results.slice(0, 25);

        for (const res of results)
            infoEmbed.addFields({ name: `${res.first_name} ${res.last_name}`, value: res.email, inline: true });

        interaction.editReply({ embeds: [infoEmbed] });

        return;
    }
}

module.exports = SearchUserCommand;