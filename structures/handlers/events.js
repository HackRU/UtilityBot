const { readdir } = require("node:fs");

class EventHandler {
    /**
     * Handler to register all event files.
     * @param {import("../../bot/index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        this.HackRUBot = client;
        this.build();
    }

    build() {

        readdir("./bot/events/", (err, category) => {

            category.forEach(category => {

                readdir(`./bot/events/${category}`, (err, files) => {

                    console.log(`INFO | Connecting to ${files.length} ${category} events...`);

                    for (const file in files) {
                        const event = new (require(`../../bot/events/${category}/${files[file]}`))(this.HackRUBot);

                        if (category == "discord") this.HackRUBot.on(files[file].split(".")[0], (...args) => event.run(...args));
                        else if (category == "process") process.on(files[file].split(".")[0], (...args) => event.run(...args));
                    }

                    console.log(`INFO | Connected to ${files.length} ${category} events`);

                });

            });

        });

    }
}

module.exports = EventHandler;