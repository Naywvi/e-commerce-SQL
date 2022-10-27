// const { faker } = require('@faker-js/faker');
const Database = require("./db/bdd.js");
const config = require("./config/config.js");
const CONFIG = require("./config/config.json");
const ConfigJSON = require("./config/config.js");

class FakeDb {
    constructor() {
        this.config = new ConfigJSON()
        this.db = new Database(CONFIG.DB.NAME);
    }
}
const jsonD = new ConfigJSON()
const start = new FakeDb()