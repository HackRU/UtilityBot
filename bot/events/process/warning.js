const { EmbedBuilder } = require("discord.js");
const Event = require("../../../structures/base/BaseEvent");

class WarningProcessEvent extends Event {
    /**
     * @param {import("../../index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        super(client);
    }

    /**
     * @param {Error} warning 
     */
    async run(warning) {

        console.error("WARNING | " + warning.stack);

        const errorEmbed = new EmbedBuilder()
            .setAuthor({ name: "Warning", iconURL: this.HackRUBot.user.displayAvatarURL() })
            .setColor("Yellow")
            .setDescription(warning.stack.length < 4000 ? warning.stack : warning.stack.substring(0, 4000))
            .setFooter({ text: this.HackRUBot.user.tag })
            .setTimestamp();

        this.HackRUBot.logs.send({ embeds: [errorEmbed] });

        return;

    }

}

module.exports = WarningProcessEvent;