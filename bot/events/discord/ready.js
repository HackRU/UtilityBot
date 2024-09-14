const Event = require("../../../structures/base/BaseEvent");
const { EmbedBuilder, ActivityType } = require("discord.js");

class ReadyEvent extends Event {
    /**
     * ready event constructor.
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client);
    }

    async run() {

        console.log(`HackRUBot (${this.HackRUBot.user.tag}) is Online`);

        const onlineEmbed = new EmbedBuilder()
            .setTitle("HackRUBot is Online")
            .addFields([
                { name: "User", value: `**${this.HackRUBot.user.tag}**`, inline: true },
                { name: "Guilds", value: `\`${this.HackRUBot.guilds.cache.size}\``, inline: true },
            ])
            .setColor("DarkGreen")
            .setTimestamp();

        this.HackRUBot.logs.send({ embeds: [onlineEmbed] });

        this.HackRUBot.user.setPresence({ activities: [{ type: ActivityType.Watching, name: "HackRU" }] });

        return;

    }

}

module.exports = ReadyEvent;