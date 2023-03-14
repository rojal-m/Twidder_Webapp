CREATE TABLE IF NOT EXISTS user (
    email       VARCHAR(50) PRIMARY KEY NOT NULL,
    password    VARCHAR(50) NOT NULL,
    firstname   VARCHAR(50) NOT NULL,
    familyname  VARCHAR(50) NOT NULL,
    gender      VARCHAR(50) NOT NULL,
    city        VARCHAR(50) NOT NULL,
    country     VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS messages (
    receiver    VARCHAR(50) NOT NULL,
    sender      VARCHAR(50) NOT NULL,
    message     VARCHAR(500) NOT NULL
    );

CREATE TABLE IF NOT EXISTS loggedIn_User (
    token       VARCHAR(50) PRIMARY KEY NOT NULL,
    email       VARCHAR(50) NOT NULL
    );