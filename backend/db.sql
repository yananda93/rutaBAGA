CREATE SCHEMA IF NOT EXISTS rutabaga;

USE rutabaga;


CREATE TABLE IF NOT EXISTS `user`
(
    `user_id`       int NOT NULL AUTO_INCREMENT,
    `user_name`      varchar(255)    DEFAULT NULL,
    `user_password`  varchar(255)    DEFAULT NULL,
    `is_experiment`       boolean DEFAULT false,
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS `user_status`
(
    `user_id`        int NOT NULL,
    `current_id`     int DEFAULT 0, 
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `application`
(
    `id`                              int NOT NULL AUTO_INCREMENT,
    `NAME_LAST`                       varchar(255)    DEFAULT NULL,
    `NAME_FIRST`                      varchar(255)    DEFAULT NULL,
    `SCHOOL_ID`                       int NOT NULL,
    `GPA`                             float DEFAULT NULL,
    `CLASS_RANK`                      int DEFAULT NULL,
    `CLASS_SIZE`                      int DEFAULT NULL,
    `SAT`                             int DEFAULT NULL,
    `SAT_MATH`                        int DEFAULT NULL,
	  `SAT_RW`                          int DEFAULT NULL,
    `GENDER`                          varchar(255)    DEFAULT NULL,
    `RACE`                            varchar(255)    DEFAULT NULL,
   
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS `comment`
(
    `id`             int NOT NULL AUTO_INCREMENT,
    `user_id`        int NOT NULL,
    `applicant_id`   int NOT NULL,
    `add_timestamp`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `content`        text,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `rating`
(
    `id`             int NOT NULL AUTO_INCREMENT,
    `user_id`        int NOT NULL,
    `applicant_id`   int NOT NULL,
    `academic`       int DEFAULT NULL,
    `leadership`     int DEFAULT NULL,
    `communication`  int DEFAULT NULL,
    `LOR_strength`   int DEFAULT NULL,
    `recommendation` int DEFAULT NULL,
    `add_timestamp`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 

    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `rating_history`
(
    `id`             int NOT NULL AUTO_INCREMENT,
    `user_id`        int NOT NULL,
    `applicant_id`   int NOT NULL,
    `dimention`      varchar(20) DEFAULT NULL,
    `rating`         int DEFAULT NULL,
    `add_timestamp`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 

    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `focus_time`
(
    `id`             int NOT NULL AUTO_INCREMENT,
    `user_id`        int NOT NULL,
    `applicant_id`   int NOT NULL,
    `total_time`     float DEFAULT 0.0,
    `Resume`         float DEFAULT 0.0,
    `PS`             float DEFAULT 0.0,
    `LOR1`           float DEFAULT 0.0,
    `LOR2`           float DEFAULT 0.0,
    `Transcripts`    float DEFAULT 0.0,
    `process_time`   bigint,

    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `reviewer_applicant`
(
    `id`           int NOT NULL AUTO_INCREMENT,
    `user_id`      int NOT NULL,
    `applicant_id` int NOT NULL,
    `viewed`       boolean DEFAULT false,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `user_setting`
(
    `user_id`                int NOT NULL,
    `Name`                   boolean DEFAULT true,
    `High School Code`       boolean DEFAULT true,
    `GPA`                    boolean DEFAULT true,
    `Class Rank`             boolean DEFAULT true,
    `SAT Score`              boolean DEFAULT true,
    `Gender`                 boolean DEFAULT true,
    `Race`                   boolean DEFAULT true,

    PRIMARY KEY(`user_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;
  
CREATE TABLE IF NOT EXISTS `user_interaction`
(
	  `id`                int NOT NULL AUTO_INCREMENT,
    `user_id`           int NOT NULL,
    `applicant_id`      int NOT NULL,
    `doc_type`          varchar(20),
    `interaction_type`  varchar(20),
    `element`           varchar(20),
    `timestamp`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    
     PRIMARY KEY(`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1;
  

  CREATE TABLE `user_vis_setting` (
  `user_id` int NOT NULL,
  `focustime` tinyint(1) DEFAULT '0',
  `color_encoding` varchar(50) DEFAULT 'rate',
  `xVar` varchar(100) DEFAULT NULL,
  `yVar` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB
AUTO_INCREMENT = 1;






