CREATE TABLE users(
idUser INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
firstName varchar(20) NOT NULL,
lastName varchar(20) NOT NULL,
email varchar(40) NOT NULL,
phoneNumber INTEGER NOT NULL
);
CREATE TABLE address(
idAddress INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
idUser INTEGER NOT NULL,
address varchar(50) NOT NULL,
country varchar(20) NOT NULL,
city varchar(20) NOT NULL,
postalCode INTEGER NOT NULL,
FOREIGN KEY (idUser) REFERENCES users(idUser)
);
CREATE TABLE type_of_product(
idType INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
name varchar(20) NOT NULL
);
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
CREATE TABLE command(
idCommand INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
idUser INTEGER NOT NULL,
total float NOT NULL,
FOREIGN KEY (idUser) REFERENCES users(idUser)
);
CREATE TABLE command_line(
idCommandLine INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
idCommand INTEGER NOT NULL,
idProduct INTEGER NOT NULL,
FOREIGN KEY (idCommand) REFERENCES command(idCommand),
FOREIGN KEY (idProduct) REFERENCES product(idProduct)
);
CREATE TABLE cart(
idCart INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
idUser INTEGER NOT NULL,
total float NOT NULL,
limitDate date NOT NULL,
FOREIGN KEY (idUser) REFERENCES users(idUser)
);
CREATE TABLE cart_temp(
idCart_Temp INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
idCart INTEGER NOT NULL,
idProduct float NOT NULL,
FOREIGN KEY (idCart) REFERENCES cart(idCart),
FOREIGN KEY (idProduct) REFERENCES product(idProduct)
);
