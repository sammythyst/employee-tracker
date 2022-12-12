DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL,
    PRIMARY KEY (id),
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL,    
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL,
    PRIMARY KEY (id),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    ON DELETE SET NULL
);