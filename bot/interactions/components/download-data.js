const { AttachmentBuilder } = require("discord.js");
const Component = require("../../../structures/base/BaseComponent");
const { ObjectId } = require("mongodb");

class DownloadDataButton extends Component {
    constructor(client) {
        super(client, {
            name: "download-data",
            category: "team",
            cooldown: 5,
        });
    }

    /**
     * @param {import("discord.js").ButtonInteraction} interaction 
     */
    async run(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const userID = interaction.message.embeds[0].author.name.split(" | ")[1];

        const users = await this.HackRUBot.db.getCollection("users");
        const user = await users.findOne({ _id: new ObjectId(userID) });

        if (!user) return interaction.editReply({ embeds: [this.HackRUBot.util.errorEmbed("No user found with this ID.")] });

        const hideProps = (key, value) => {
            if (["password", "auth", "token"].some(k => key.includes(k))) return undefined;
            else return value;
        };

        const data = new AttachmentBuilder()
            .setFile(Buffer.from(JSON.stringify(user, hideProps, 2)))
            .setName(`HackRU-${user.email}.json`);

        interaction.editReply({ files: [data] });

        return;

    }
}

module.exports = DownloadDataButton;