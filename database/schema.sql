-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS `Schedule`;
DROP TABLE IF EXISTS `Discipline`;


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

