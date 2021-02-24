CREATE DATABASE nodejslogin;
USE nodejslogin;
CREATE TABLE users ( 
	id int AUTO_INCREMENT,
	username varchar(20),
	fullname varchar(20),
	email varchar(30),
	password varchar(128),
	active int(10),
	PRIMARY KEY (id)
);
CREATE TABLE products ( 
	id int AUTO_INCREMENT,
	name varchar(40),
	detail text(255),
	price int(12),
	img varchar(255),
	PRIMARY KEY (id)
);
