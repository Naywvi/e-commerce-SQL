const CONFIG = require("./config.json");
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const randomName = faker.name.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const Tasks = [
    "USER",
    "ADDRESS",
    "TYPE_OF_PRODUCT",
    "PRODUCT",
    "COMMAND",
    "COMMAND_LINE",
    "CART",
    "CART_TEMP"
]
const identifier = [
    ["idUser", "firstName", "lastName", "email", "phoneNumber"],
    ["idAddress", "idUser", "address", "country", "city", "postalCode"],
    ["idType", "name"],
    ["idProduct", "name", "idType", "description", "image", "stockAvailable", "price", ],
    ["idCommand", "idUser", "total"],
    ["idCommandLine", "idCommand", "idProduct"],
    ["idCart", "idUser", "total", "limitDate"],
    ["idCart_Temp", "idCart", "idProduct"]
]
module.exports = class ConfigJSON {

    constructor() {
        this.generateTable();
        this.generateUser();
    }
    generateUser() {
        for (let index = 0; index < 3; index++) {
            var jsonContent = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));
            jsonContent.USER.idUser = index;
            jsonContent.USER.firstName = faker.name.firstName();
            jsonContent.USER.lastName = faker.name.lastName();
            jsonContent.USER.email = faker.internet.email();
            const jsonw = JSON.stringify(jsonContent)
            fs.writeFileSync("./config/config.json", jsonw);
        }

    }
    generateTable() {
        var count = 0;

        Tasks.forEach(tableTask => {
            var jsonContent = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));
            jsonContent[tableTask] = {}
            const jsonw = JSON.stringify(jsonContent)
            fs.writeFileSync("./config/config.json", jsonw);

        });

        Tasks.forEach(tableTask => {
            identifier[count].forEach(id => {
                var jsonContent = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));
                jsonContent[tableTask][id] = ""
                const jsonw = JSON.stringify(jsonContent)
                fs.writeFileSync("./config/config.json", jsonw);
            });
            count += 1;
        });

    }
}