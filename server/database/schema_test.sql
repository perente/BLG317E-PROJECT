DROP TABLE IF EXISTS `Schedules`;
DROP TABLE IF EXISTS `Discipline`;


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
