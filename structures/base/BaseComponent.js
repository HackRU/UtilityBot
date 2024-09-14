class Component {
    /**
     * @typedef {Object} CommandConfigOptions
     * @property {string} name Name of the component.
     * @property {"general"|"team"|"admin"|"dev"} category Category of the component.
     * @property {number} [cooldown=0] The cooldown for the component.
     */

    /**
     * Base component constructor.
     * @param {import("../../bot/index.js")} client HackRUBot's Discord Client.
     * @param {CommandConfigOptions} commandConfig The component configuration. 
     */
    constructor(client, commandConfig) {
        this.HackRUBot = client;
        this.config = commandConfig;
    }
}

module.exports = Component;