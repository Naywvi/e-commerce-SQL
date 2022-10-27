const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const CONFIG = require("../config/config.json")
const fs = require('fs');

const tt = (task) => {
    switch (task) {
        case "CREATE_TABLE_USER":
            return `
                CREATE TABLE users(
                    idUser INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    firstName varchar(20) NOT NULL,
                    lastName varchar(20) NOT NULL,
                    email varchar(40) NOT NULL,
                    phoneNumber INTEGER NOT NULL
                    );
                `
        case "CREATE_TABLE_ADDRESS":
            return `
                CREATE TABLE address(
                    idAddress INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    idUser INTEGER NOT NULL,
                    address varchar(50) NOT NULL,
                    country varchar(20) NOT NULL,
                    city varchar(20) NOT NULL,
                    postalCode INTEGER NOT NULL,
                    FOREIGN KEY (idUser) REFERENCES users(idUser)
                    );
                `
        case "CREATE_TABLE_TYPE_OF_PRODUCT":
            return `
                CREATE TABLE type_of_product(
                    idType INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    name varchar(40) NOT NULL
                    );
                `
        case "CREATE_TABLE_PRODUCT":
            return `
                CREATE TABLE product(
                    idProduct INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    name varchar(50) NOT NULL,
                    idType INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    image varchar(50) NOT NULL,
                    stockAvailable INTEGER NOT NULL,
                    price Float NOT NULL,
                    FOREIGN KEY (idType) REFERENCES type_of_product(idType)
                    );
                `
        case "CREATE_TABLE_COMMAND":
            return `
                CREATE TABLE command(
                    idCommand INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    idUser INTEGER NOT NULL,
                    total float NOT NULL,
                    FOREIGN KEY (idUser) REFERENCES users(idUser)
                    );
                `

        case "CREATE_TABLE_COMMAND_LINE":
            return `
                CREATE TABLE command_line(
                    idCommandLine INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    idCommand INTEGER NOT NULL,
                    idProduct INTEGER NOT NULL,
                    FOREIGN KEY (idCommand) REFERENCES command(idCommand),
                    FOREIGN KEY (idProduct) REFERENCES product(idProduct)
                    );
                `
        case "CREATE_TABLE_CART":
            return `
                CREATE TABLE cart(
                    idCart INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    idUser INTEGER NOT NULL,
                    total float NOT NULL,
                    limitDate date NOT NULL,
                    FOREIGN KEY (idUser) REFERENCES users(idUser)
                    );
                `
        case ("CREATE_TABLE_CART_TEMP"):
            return `
                CREATE TABLE cart_temp(
                    idCart_Temp INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    idCart INTEGER NOT NULL,
                    idProduct float NOT NULL,
                    FOREIGN KEY (idCart) REFERENCES cart(idCart),
                    FOREIGN KEY (idProduct) REFERENCES product(idProduct)
                    );
                    `
        case "INSERT_TABLE_USERS":
            return `INSERT INTO users(firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?)`

        case "INSERT_TABLE_ADDRESS":
            return "INSERT INTO address(idUser, address, country, city, postalCode) VALUES(?, ?, ?, ?, ?)"

        case "INSERT_TABLE_TYPE_OF_PRODUCT":
            return "INSERT INTO type_of_product(name) VALUES(?)"

        case "INSERT_TABLE_PRODUCT":
            return "INSERT INTO product(name, idType, description, image, stockAvailable, price) VALUES(?, ?, ?, ?, ?, ?)"

        case "INSERT_TABLE_COMMAND":
            return "INSERT INTO command(idUser, total) VALUES(?, ?)"

        case "INSERT_TABLE_COMMAND_LINE":
            return "INSERT INTO command_line(idCommand, idProduct) VALUES(?, ?)"

        case "INSERT_TABLE_CART":
            return "INSERT INTO cart(idUser, total, limitDate) VALUES(?, ?, ?)"

        case "INSERT_TABLE_CART_TEMP":
            return "INSERT INTO cart_temp(idCart, idProduct) VALUES(?, ?)"
    }
    return null
}
module.exports = class Database {
    constructor(DatabaseName) {
        this.db = new sqlite3.Database(DatabaseName, (err) => {
            if (err) console.error(err.message);
            console.log(` [+] Connected to the Database: ${ CONFIG.DB.NAME }`);
        });
        //this.createTables();
        this.insert();
    }


    insert() {

        var js = CONFIG

        for (let index = 1; index < js.USER.idUser.length; index++) {
            setTimeout(() => this.db.run(tt("INSERT_TABLE_USERS"), [js.USER.firstName[index], js.USER.lastName[index], js.USER.email[index], js.USER.phoneNumber[index]]), 500)
        }
        for (let index = 1; index < js.ADDRESS.idAddress.length; index++) {
            setTimeout(() => this.db.run(tt("INSERT_TABLE_ADDRESS"), [js.ADDRESS.idUser[index], js.ADDRESS.address[index], js.ADDRESS.country[index], js.ADDRESS.city[index], js.ADDRESS.postalCode[index]]), 500)
        }
        for (let index = 1; index < js.TYPE_OF_PRODUCT.idType.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_TYPE_OF_PRODUCT"), [js.TYPE_OF_PRODUCT.name[index]]) }, 500)
        }
        for (let index = 0; index < js.PRODUCT.idProduct.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_PRODUCT"), [js.PRODUCT.name[index], js.PRODUCT.idType[index], js.PRODUCT.description[index], js.PRODUCT.image[index], js.PRODUCT.stockAvailable[index], js.PRODUCT.price[index]]) })
        }
        for (let index = 0; index < js.COMMAND.idCommand.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_COMMAND"), [js.COMMAND.idUser[index], js.COMMAND.total[index]]) })
        }
        for (let index = 0; index < js.COMMAND_LINE.idCommandLine.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_COMMAND_LINE"), [js.COMMAND_LINE.idCommand[index], js.COMMAND_LINE.idProduct[index]]) })
        }
        for (let index = 0; index < js.CART.idCart.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_CART"), [js.CART.idUser[index], js.CART.total[index], js.CART.limitDate[index]]) })
        }
        for (let index = 0; index < js.CART_TEMP.idCart_Temp.length; index++) {
            setTimeout(() => { this.db.run(tt("INSERT_TABLE_CART_TEMP"), [js.CART_TEMP.idCart[index], js.CART_TEMP.idProduct[index]]) })
        }
    }

    createTables() {
        var Tasks = [
            tt("CREATE_TABLE_USER"),
            tt("CREATE_TABLE_ADDRESS"),
            tt("CREATE_TABLE_TYPE_OF_PRODUCT"),
            tt("CREATE_TABLE_PRODUCT"),
            tt("CREATE_TABLE_COMMAND"),
            tt("CREATE_TABLE_COMMAND_LINE"),
            tt("CREATE_TABLE_CART"),
            tt("CREATE_TABLE_CART_TEMP")
        ]
        Tasks.forEach(tableTask => {
            this.db.run(tableTask);
        });

    }

    closeDb() {
        this.db.close((err) => {
            if (err) console.error(err.message);
            console.log('Close the database connection.');
        });
    }
}