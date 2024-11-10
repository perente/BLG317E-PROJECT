-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS `Schedule`;
DROP TABLE IF EXISTS `Discipline`;
DROP TABLE IF EXISTS `Country`;
DROP TABLE IF EXISTS `Events`;

-- Create Schedule Table
CREATE TABLE `Schedule` (
    `schedule_code` INT NOT NULL AUTO_INCREMENT,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `gender` CHAR(1),
    `status` CHAR(1),
    `event_name` VARCHAR(255),
    `event_code` INT,
    `venue` VARCHAR(255),
    `url` VARCHAR(255),
    `phase` VARCHAR(255),
    `discipline_code` INT,
    PRIMARY KEY (`schedule_code`),
    FOREIGN KEY (`event_code`) REFERENCES `Events`(`events_code`) ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        FOREIGN KEY (`discipline_code`) REFERENCES `Discipline`(`id`) ON DELETE
    SET
        NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create Discipline Table
CREATE TABLE `Discipline` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `discipline_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_discipline_code` (`discipline_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create Country Table
CREATE TABLE `Country` (
    `country_code` CHAR(3) NOT NULL,
    `country_name` VARCHAR(255) NOT NULL,
    `country_long` VARCHAR(255),
    `gold_medal` INT DEFAULT 0,
    `silver_medal` INT DEFAULT 0,
    `bronze_medal` INT DEFAULT 0,
    `total` INT GENERATED ALWAYS AS (`gold_medal` + `silver_medal` + `bronze_medal`) STORED,
    PRIMARY KEY (`country_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create Events Table
CREATE TABLE `Events` (
    `events_code` INT NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255),
    `discipline_code` CHAR(3),
    `sport_name` VARCHAR(255),
    PRIMARY KEY (`events_code`),
    FOREIGN KEY (`discipline_code`) REFERENCES `Discipline`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT = 0;

-- Create Teams Table
CREATE TABLE  `Teams` (
    `team_code` VARCHAR(10) PRIMARY KEY,
    `team_name` VARCHAR(100),
    `team_gender` CHAR(1),
    `country_code` VARCHAR(10),
    `discipline_code` INT,
    `athletes_code` INT,
    `num_athletes` INT,
    
    FOREIGN KEY (`country_code`) REFERENCES Country(`country_code`),
    FOREIGN KEY (`discipline_code`) REFERENCES Discipline(`discipline_code`),
    FOREIGN KEY (`athletes_code`) REFERENCES Athletes(`athletes_code`)
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
