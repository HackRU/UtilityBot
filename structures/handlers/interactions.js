const { readdir } = require("fs");

class InteractionHandler {
    /**
     * Handler to register all bot interaction files.
     * @param {import("../../bot/index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        this.HackRUBot = client;
        this.build();
    }

    build() {

        readdir("./bot/interactions/textcommands/", (err, files) => {

            const cmdFiles = files.filter(f => f.split(".").pop() === "js");

            console.log(`INFO | Loading ${cmdFiles.length} text commands...`);

            for (const f in cmdFiles) {
                const cmd = new (require(`../../bot/interactions/textcommands/${cmdFiles[f]}`))(this.HackRUBot);
                this.HackRUBot.commands.set(cmd.config.name, cmd);
            }

            console.log(`INFO | Loaded ${cmdFiles.length} text commands`);

        });

        readdir("./bot/interactions/slashcommands/", (err, files) => {

            const cmdFiles = files.filter(f => f.split(".").pop() === "js");

            console.log(`INFO | Loading ${cmdFiles.length} slash commands...`);

            for (const f in cmdFiles) {
                const cmd = new (require(`../../bot/interactions/slashcommands/${cmdFiles[f]}`))(this.HackRUBot);
                this.HackRUBot.slashCommands.set(cmd.config.name, cmd);
            }

            console.log(`INFO | Loaded ${cmdFiles.length} slash commands`);

        });

        readdir("./bot/interactions/components/", (err, files) => {

            const cmdFiles = files.filter(f => f.split(".").pop() === "js");

            console.log(`INFO | Loading ${cmdFiles.length} components...`);

            for (const f in cmdFiles) {
                const cmd = new (require(`../../bot/interactions/components/${cmdFiles[f]}`))(this.HackRUBot);
                this.HackRUBot.components.set(cmd.config.name, cmd);
            }

            console.log(`INFO | Loaded ${cmdFiles.length} components`);

        });

    }
}

module.exports = InteractionHandler;