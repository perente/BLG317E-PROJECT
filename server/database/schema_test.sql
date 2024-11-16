DROP TABLE IF EXISTS `Schedule`;

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
    PRIMARY KEY (`schedule_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `Schedule` (`start_date`, `end_date`, `gender`, `status`, `event_name`, `event_code`, `venue`, `url`, `phase`, `discipline_code`) VALUES
('2023-10-15', '2023-10-20', 'F', 'A', 'National Championship', 202, 'Olympic Stadium', 'https://example.com/events/202', 'Semi-finals', 10),
('2023-11-01', '2023-11-05', 'M', 'A', 'International Open', 203, 'National Arena', 'https://example.com/events/203', 'Finals', 12),
('2023-12-10', '2023-12-15', 'F', 'A', 'Winter Games', 204, 'Snow Arena', 'https://example.com/events/204', 'Qualifiers', 14),
('2024-01-05', '2024-01-10', 'M', 'A', 'Spring Tournament', 205, 'Green Field', 'https://example.com/events/205', 'Group Stage', 16),
('2024-02-20', '2024-02-25', 'F', 'A', 'City Marathon', 206, 'Downtown Streets', 'https://example.com/events/206', 'Finals', 18),
('2024-03-15', '2024-03-20', 'M', 'A', 'Regional Qualifiers', 207, 'High School Stadium', 'https://example.com/events/207', 'Qualifiers', 20),
('2024-04-10', '2024-04-15', 'F', 'A', 'State Championship', 208, 'State Arena', 'https://example.com/events/208', 'Semi-finals', 22),
('2024-05-05', '2024-05-10', 'M', 'A', 'National Finals', 209, 'Capital Stadium', 'https://example.com/events/209', 'Finals', 24),
('2024-06-01', '2024-06-05', 'F', 'A', 'Summer Games', 210, 'Beachside Arena', 'https://example.com/events/210', 'Group Stage', 26),
('2024-07-15', '2024-07-20', 'M', 'A', 'International Cup', 211, 'Global Stadium', 'https://example.com/events/211', 'Finals', 28);

