class Event {

    /**
     * Base event constructor.
     * @param {import("../../bot/index.js")} client HackRUBot's Discord Client.
     */
    constructor(client) {
        this.HackRUBot = client;
    }
}

module.exports = Event;