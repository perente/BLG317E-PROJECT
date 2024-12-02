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

-- Create Discipline Table
CREATE TABLE `Discipline` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `discipline_code` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_discipline_code` (`discipline_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- Create Events Table
CREATE TABLE `Events` (
    `events_code` INT NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255),
    `discipline_code` CHAR(50),
    `sport_name` VARCHAR(255),
    PRIMARY KEY (`events_code`),
    FOREIGN KEY (`discipline_code`) REFERENCES `Discipline`(`discipline_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT = 0;


-- Create Schedule Table
CREATE TABLE `Schedule` (
    `schedule_code` INT NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(255) NOT NULL,
    `end_date` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255),
    `discipline_code` VARCHAR(50), 
    `event_name` VARCHAR(255),
    `phase` VARCHAR(255),
    `gender` CHAR(1),
    `venue` VARCHAR(255),
    `event_code` INT,
    `url` VARCHAR(255) NULL,
    PRIMARY KEY (`schedule_code`),
    FOREIGN KEY (`event_code`) REFERENCES `Events`(`events_code`) ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        FOREIGN KEY (`discipline_code`) REFERENCES `Discipline`(`discipline_code`) ON DELETE
    SET
        NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- Create Teams Table
CREATE TABLE `Teams` (
    `team_code` VARCHAR(255) PRIMARY KEY,
    `team_name` VARCHAR(255),
    `team_gender` CHAR(1) NOT NULL,
    `country_code` CHAR(3),
    `discipline_code` CHAR(50),
    `num_athletes` INT,
    FOREIGN KEY (`country_code`) REFERENCES Country(`country_code`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`discipline_code`) REFERENCES Discipline(`discipline_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- Create Athlete Table
CREATE TABLE  `Athlete` (
    `athlete_code` INT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `gender` CHAR(1) NOT NULL,
    `country_code` VARCHAR(3) ,
    `nationality` VARCHAR(50),
    `birth_date` DATE NOT NULL,
    
    FOREIGN KEY (`country_code`) REFERENCES Country(`country_code`) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- Create Coach Table
CREATE TABLE  `Coach` (
    `coach_code` INT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `gender` CHAR(1) NOT NULL,
    `function` VARCHAR(20) NOT NULL,
    `birth_date` DATE,
    `country_code` VARCHAR(3),
    `disciplines` VARCHAR(50),
    
    FOREIGN KEY (`country_code`) REFERENCES Country(`country_code`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`disciplines`) REFERENCES Discipline(`name`) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create Medallist Table
CREATE TABLE `Medallist` (
    `id` INT NOT NULL PRIMARY KEY,
    `medal_date` DATE NOT NULL,
    `medal_code` INT NOT NULL,
    `gender` ENUM('M', 'F') NOT NULL,
    `country_code` CHAR(3),
    `team_gender` ENUM('M', 'W', 'Mixed', 'No Team') default 'No Team',
    `discipline` VARCHAR(50),
    `event` VARCHAR(255),
    `code_athlete` INT,
    `code_team` VARCHAR(50),
    FOREIGN KEY (`country_code`) REFERENCES Country(`country_code`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`discipline`) REFERENCES Discipline(`name`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`code_athlete`) REFERENCES Athlete(`athlete_code`) ON DELETE SET NULL ON UPDATE CASCADE,
	FOREIGN KEY (`code_team`) REFERENCES Teams(`team_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create Athlete_Disciplines Join Table
CREATE TABLE `Athlete_Disciplines` (
    `athlete_code` INT,
    `discipline_code` VARCHAR(50),
    
    PRIMARY KEY (`athlete_code`, `discipline_code`),
    FOREIGN KEY (`athlete_code`) REFERENCES Athlete(`athlete_code`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`discipline_code`) REFERENCES Discipline(`discipline_code`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Team_Athlete` (
    `team_code` VARCHAR(255),
    `athlete_code` VARCHAR(255),
    PRIMARY KEY (`team_code`, `athlete_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT = 0;

CREATE TABLE `Team_Coach` (
    `team_code` VARCHAR(255),
    `coach_code` INT,
    PRIMARY KEY (`team_code`, `coach_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT = 0;