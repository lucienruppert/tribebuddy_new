CREATE TABLE tribebuddy_modules (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(36) NOT NULL
);

CREATE TABLE tribebuddy_cards (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(36) NOT NULL
);

CREATE TABLE tribebuddy_users_modules (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT(11) NOT NULL,
    moduleId INT(11) NOT NULL,
    CONSTRAINT fk_userId FOREIGN KEY (userId) REFERENCES users_tribebuddy(id) ON DELETE CASCADE,
    CONSTRAINT fk_moduleId FOREIGN KEY (moduleId) REFERENCES tribebuddy_modules(id) ON DELETE CASCADE
);

CREATE TABLE users_tribebuddy (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(11) NOT NULL DEFAULT 'user',
    sex VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE userProfile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    nickname VARCHAR(20),
    age INT,
    height INT,
    build VARCHAR(50),
    languages TEXT,
    movies TEXT,
    music TEXT,
    books TEXT,
    foods TEXT,
    drinks TEXT,
    county VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    aboutMe TEXT
);

ALTER TABLE
    tribebuddy_userProfiles
ADD
    CONSTRAINT fk_userId FOREIGN KEY (userId) REFERENCES users_tribebuddy(id) ON DELETE CASCADE;

CREATE TABLE tribebuddy_userPhotos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    isProfile BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_photos_userId FOREIGN KEY (userId) REFERENCES users_tribebuddy(id)
);

CREATE INDEX idx_user_photos_userId ON tribebuddy_userPhotos(userId);
