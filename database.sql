CREATE DATABASE IF NOT EXISTS student_tracker;

USE student_tracker;

CREATE TABLE IF NOT EXISTS skills (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS internships (
    id INT NOT NULL AUTO_INCREMENT,
    COMPANY VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT NOT NULL AUTO_INCREMENT,
    internship_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'applied',
    PRIMARY KEY (id),
    KEY internship_id (internship_id),
    CONSTRAINT fk_internship
        FOREIGN KEY (internship_id)
        REFERENCES internships (id)
);

INSERT INTO skills (name) VALUES ('Excel');

INSERT INTO internships (COMPANY, role)
VALUES ('Google', 'Software Intern');

INSERT INTO applications (internship_id, status)
VALUES (1, 'applied');