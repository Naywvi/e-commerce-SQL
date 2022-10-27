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
const category = [
        "Appliances",
        "Apps & Games",
        "Arts, Crafts, & Sewing",
        "Automotive Parts & Accessories",
        "Baby",
        "Beauty & Personal Care",
        "Books",
        "CDs & Vinyl",
        "Cell Phones & Accessories",
        "Clothing, Shoes and Jewelry",
        "Collectibles & Fine Art",
        "Computers",
        "Electronics",
        "Garden & Outdoor",
        "Grocery & Gourmet Food",
        "Handmade",
        "Health, Household & Baby Care",
        "Home & Kitchen",
        "Industrial & Scientific",
        "Kindle",
        "Luggage & Travel Gear",
        "Movies & TV",
        "Musical Instruments",
        "Office Products",
        "Pet Supplies",
        "Sports & Outdoors",
        "Tools & Home Improvement",
        "Toys & Games",
        "Video Games"
    ] // 29 categories
    //Total error commande > commande line
var totalPrice = [];
jsonContent = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));
module.exports = class ConfigJSON {

    constructor() {
        var nbUser = 500;
        var nbProduct = 1000;
        var nbCommand = 10;
        var nbCart = 10;

        this.generateTable();
        this.generateUser(nbUser);
        this.generateAdress(nbUser);
        this.generateTypeOfProduct();
        this.generateProduct(nbProduct);
        this.generateCommand(nbCommand);
        this.generateCommandLine(nbCommand, nbProduct);
        this.generateCart(nbCart);
        this.generateCartTemp(nbCart);

        const jsonw = JSON.stringify(jsonContent)
        fs.writeFileSync("./config/config.json", jsonw);
    }
    generateTable() {
        var count = 0;

        Tasks.forEach(tableTask => { jsonContent[tableTask] = {} });
        Tasks.forEach(tableTask => {
            identifier[count].forEach(id => { jsonContent[tableTask][id] = "" });
            count += 1;
        });

    }

    generateUser(nbUser) {
        var idUser = []
        var FName = []
        var LName = []
        var email = []
        var phoneNumber = []

        for (let index = 0; index < nbUser; index++) {
            idUser.push(index)
            FName.push(faker.name.firstName())
            LName.push(faker.name.lastName())
            email.push(faker.internet.email())
            phoneNumber.push(faker.phone.number('###-555-###'))
        }

        jsonContent.USER.idUser = idUser;
        jsonContent.USER.firstName = FName;
        jsonContent.USER.lastName = LName;
        jsonContent.USER.email = email;
        jsonContent.USER.phoneNumber = phoneNumber;

    }

    generateAdress(idUser) {
        var idAddress = []
        var iduser = []
        var address = []
        var country = []
        var city = []
        var postalCode = []

        for (let indexU = 0; indexU < idUser; indexU++) {
            var ilenght = Math.floor(Math.random() * 3)
            if (ilenght > 0) {
                for (let indexA = 1; indexA <= ilenght; indexA++) {
                    idAddress.push(idAddress.length);
                    iduser.push(indexU);
                    address.push(faker.address.streetAddress(true));
                    country.push(faker.address.country());
                    city.push(faker.address.city());
                    postalCode.push(faker.address.zipCode());
                }
            }
        }

        jsonContent.ADDRESS.idAddress = idAddress;
        jsonContent.ADDRESS.idUser = iduser;
        jsonContent.ADDRESS.address = address;
        jsonContent.ADDRESS.country = country;
        jsonContent.ADDRESS.city = city;
        jsonContent.ADDRESS.postalCode = postalCode;

    }

    generateTypeOfProduct() {
        var idType = [];
        var name = [];

        for (let index = 0; index < category.length; index++) {
            idType.push(index);
            name.push(category[index]);
        }

        jsonContent.TYPE_OF_PRODUCT.idType = idType;
        jsonContent.TYPE_OF_PRODUCT.name = name;
    }

    generateProduct(nbProduct) {
        var idProduct = [];
        var name = [];
        var idType = [];
        var description = [];
        var image = [];
        var stockAvailable = [];
        var price = [];

        for (let index = 0; index < nbProduct; index++) {
            idProduct.push(index);
            name.push(faker.commerce.productName());
            idType.push(Math.floor(Math.random() * category.length));
            description.push(faker.commerce.productDescription());
            image.push(faker.image.imageUrl());
            stockAvailable.push(Math.floor(Math.random() * 1000));
            var pricetmp = Math.random() * (200 - 0.99) + 0.99
            price.push(pricetmp.toFixed(2));
        }
        jsonContent.PRODUCT.idProduct = idProduct;
        jsonContent.PRODUCT.name = name;
        jsonContent.PRODUCT.idType = idType;
        jsonContent.PRODUCT.description = description;
        jsonContent.PRODUCT.image = image;
        jsonContent.PRODUCT.stockAvailable = stockAvailable;
        jsonContent.PRODUCT.price = price;
    }

    generateCommand(nbCommand) {
        var idCommand = [];
        var idUser = [];

        for (let index = 0; index < nbCommand; index++) {
            idCommand.push(index);
            idUser.push(Math.floor(Math.random() * jsonContent.USER.idUser.length));

        }

        jsonContent.COMMAND.idCommand = idCommand;
        jsonContent.COMMAND.idUser = idUser;

    }

    generateCommandLine(nbCommand, nbProduct) {
        var total = [];
        var count = 0;

        var idCommandLine = [];
        var idCommand = [];
        var idProduct = [];

        for (let index = 0; index < nbCommand; index++) {
            var nbCommandLine = Math.floor(Math.random() * (3 - 1) + 1)

            for (let indexL = 0; indexL < nbCommandLine; indexL++) {

                idCommandLine.push(count);
                idCommand.push(Math.floor(Math.random() * nbCommand));
                idProduct.push(Math.floor(Math.random() * nbProduct));

                var priceProduct = jsonContent.PRODUCT.price[idProduct[index]]
                total.push(parseFloat(priceProduct))
                count += 1;
            }
            this.calculateTotal(total);
        }

        jsonContent.COMMAND_LINE.idCommandLine = idCommandLine;
        jsonContent.COMMAND_LINE.idCommand = idCommand;
        jsonContent.COMMAND_LINE.idProduct = idProduct;
        jsonContent.COMMAND.total = totalPrice;
    }

    generateCart(nbCart) {
        var idCart = [];
        var idUser = [];
        var limitDate = [];

        for (let index = 0; index < nbCart; index++) {
            idCart.push(index);
            idUser.push(Math.floor(Math.random() * jsonContent.USER.idUser.length));
            limitDate.push(faker.date.future());
        }

        jsonContent.CART.idCart = idCart;
        jsonContent.CART.idUser = idUser;
        jsonContent.CART.limitDate = limitDate;

    }
    generateCartTemp(nbCart) {
        var idCart_Temp = [];
        var idCart = [];
        var idProduct = [];
        var total = [];
        var count = 0;
        totalPrice = [];

        for (let indexC = 0; indexC < nbCart; indexC++) {

            var randomCartL = Math.floor(Math.random() * (3 - 1) + 1);

            for (let index = 0; index < randomCartL; index++) {
                idCart_Temp.push(count);
                idCart.push(Math.floor(Math.random() * nbCart));
                idProduct.push(Math.floor(Math.random() * jsonContent.PRODUCT.idProduct.length));

                var priceProduct = jsonContent.PRODUCT.price[idProduct[index]]
                total.push(parseFloat(priceProduct))

                count += 1;
            }
            this.calculateTotal(total);
        }
        jsonContent.CART_TEMP.idCart_Temp = idCart_Temp;
        jsonContent.CART_TEMP.idCart = idCart;
        jsonContent.CART_TEMP.idProduct = idProduct;
        jsonContent.CART.total = totalPrice;
    }


    calculateTotal(command) {
        var total = 0;
        command.forEach(price => { total += price; });
        totalPrice.push(total.toFixed(2));
    }
}