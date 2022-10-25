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
                    name varchar(20) NOT NULL
                    );
                `
        case "CREATE_TABLE_PRODUCT":
            return `
                CREATE TABLE product(
                    idProduct INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    name varchar(50) NOT NULL,
                    idType INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    image BLOB NOT NULL,
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
    }
    return null
}
module.exports = class Database {
    constructor(DatabaseName) {
        this.db = new sqlite3.Database(DatabaseName, (err) => {
            if (err) console.error(err.message);
            console.log(` [+] Connected to the Database: $ { CONFIG.DB.NAME }
                `);
        });
        this.createTables();
    }


    insert(FirstName, LastName, Rank) {
        setTimeout(() =>
            this.db.run(tt("INSERT_TABLE_USERS"), [this.generateIdConnect(FirstName), FirstName.charAt(0).toUpperCase() + FirstName.slice(1).toLowerCase(), LastName.charAt(0).toUpperCase() + LastName.slice(1).toLowerCase(), this.generateToken(), Rank]), 500)
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