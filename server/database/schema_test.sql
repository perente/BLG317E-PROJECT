DROP TABLE IF EXISTS `Schedules`;
DROP TABLE IF EXISTS `Discipline`;
DROP TABLE IF EXISTS `Country`;
DROP TABLE IF EXISTS `Events`;


CREATE TABLE `Schedule` (
    `schedule_code` INT NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(255) NOT NULL,
    `end_date` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255), -- Adjusted to accommodate values like "FINISHED"
    `discipline_code` VARCHAR(255), -- Adjusted to store alphanumeric values like "MPN"
    `event_name` VARCHAR(255),
    `phase` VARCHAR(255),
    `gender` CHAR(1),
    `venue` VARCHAR(255),
    `event_code` INT,
    `url` VARCHAR(255) NULL,
    PRIMARY KEY (`schedule_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Discipline` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `discipline_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_discipline_code` (`discipline_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

CREATE TABLE `Events` (
    `events_code` INT NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255),
    `discipline_code` CHAR(3),
    `sport_name` VARCHAR(255),
    PRIMARY KEY (`events_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT = 0;
