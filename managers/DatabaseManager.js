const { MongoClient } = require("mongodb");

class DatabaseManager {
    /**
     * Manager for database.
     * @param {import("../bot/index.js")} client HackRUBot's Discord Client.
     */
    constructor(client, uri) {
        this.HackRUBot = client;
        this.mongo = new MongoClient(uri);
        this.connect();
    }

    async connect() {
        try {
            await this.mongo.db().command({ ping: 1 });
        } catch (e) {
            await this.mongo.connect();
        }
    }

    async getCollection(name) {
        await this.connect();
        return this.mongo.db().collection(name);
    }

}

module.exports = DatabaseManager;