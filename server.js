const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");


const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "qwer1234",
        database: "company_db",
    });

db.connect(async function() {
    askUser();
})


// ask questions
const askUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'What would you like to do?',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role']
        }

    ])
    .then(({selection}) => {
        if (selection === "View all departments") {
            viewDepartments();            
        }

        if (selection === "View all roles") {
            viewRoles();
        }

        if (selection === "View all employees") {
            viewEmployees();
        }

        if (selection === "Add a department") {
            
        }

        if (selection === "Add a role") {
            
        }

        if (selection === "Add an employee") {
            
        }

        if (selection === "Update an employee role") {
            
        }

    });
};


viewDepartments = () => {
    db.query(`SELECT department.id, department.dept_name AS department FROM department`, function (err, results) {
        console.table(results);
        askUser();
    });  
}

viewRoles = () => {
    db.query(`SELECT roles.id, roles.title, roles.salary, roles.department_id AS dept_id FROM roles JOIN department ON roles.department_id = department.id`, function (err, results) {
        console.table(results);
        askUser();
    })
}

viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name AS first, employee.last_name AS last, employee.role_id AS role, employee.manager_id AS manager FROM employee`, function (err, results) {
        console.table(results);
        askUser();
    })
}