CREATE DATABASE IF NOT EXISTS degree_audit;

CREATE TABLE STUDENT
(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    EMAIL VARCHAR(250) NOT NULL,
    STUDENT_ID INT NOT NULL,
    PASSWORD VARCHAR(250) NOT NULL,
    AUTH_CODE INT,
    STATUS INT DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE COURSE
(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    STUDENTID INT NOT NULL,
    NAME VARCHAR(250) NOT NULL,
    GRADE VARCHAR(2),
    UNITS INT,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (STUDENTID) REFERENCES STUDENT(ID)
);