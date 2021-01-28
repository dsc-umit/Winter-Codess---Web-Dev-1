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
