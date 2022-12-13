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
            addDepartment();
        }

        if (selection === "Add a role") {
            addRole();
        }

        if (selection === "Add an employee") {
            addEmployee();
        }

        if (selection === "Update an employee role") {
            updateRole();
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
    db.query(`SELECT roles.id, roles.title, roles.salary, department.dept_name AS department
    FROM roles
    JOIN department ON roles.department_id = department.id`, function (err, results) {
        console.table(results);
        askUser();
    })
}

viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name AS first, employee.last_name AS last, roles.title AS role, department.dept_name AS department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    JOIN roles ON employee.role_id = roles.id
    JOIN department ON roles.department_id = department.id
    JOIN employee manager ON employee.manager_id = manager.id`, function (err, results) {
        console.table(results);
        askUser();
    })
}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input', 
            name: 'newDept',
            message: 'What department would you like to add?',
        }
    ])
    .then(answer => {
        db.query(`INSERT INTO department (dept_name)
        VALUES (?)`, answer.newDept, (err, results) => {
            console.log('Added ' + answer.newDept + ' to departments database.');

            viewDepartments();
        })
    })
}


addRole = () => {
    const roleDept = [];
    db.query(`SELECT * FROM department`, (err, results) => {
        results.forEach(dep => {
            let dept = {
                name: dep.dept_name,
                value: dep.id
            }
            roleDept.push(dept);
        });
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What role would you like to add?',
        },
        {
            type: 'input',
            name: 'newPay',
            message: 'What is the salary of this new role?',
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: "What department does this role belong?",
            choices: roleDept
        }
    ])
    .then(answer => {
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [[answer.newRole, answer.newPay, answer.roleDepartment]], (err, results) => {
            console.log('Added ' + answer.newRole + ' to roles database.');
            viewRoles();
        })
    })
}


addEmployee = () => {
    db.query("SELECT * FROM employee", (err, employee) => {
        const newEmp = [{
            name: 'None',
            value: 0
          }]; 

        employee.forEach(({first_name, last_name, id}) => {
          newEmp.push({
            name: first_name + " " + last_name,
            value: id
          });
        });
        
        db.query("SELECT * FROM roles", (err, empRole) => {
          const newEmpRole = [];
          empRole.forEach(({title, id}) => {
            newEmpRole.push({
              name: title,
              value: id
              });
            });
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastname',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: "What is this employee's role?",
            choices: newEmpRole
        }
    ])
    .then(answer=> {
        const newEmployee = [answer.firstname, answer.lastname];

        db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`, [[answer.firstname, answer.lastname, answer.employeeRole]], (err, results) => {
            console.log('Added ' + newEmployee + ' to employee database.');
            viewEmployees();
        });
    })
});
})
}

updateRole = () => {
    db.query(`SELECT * FROM employee`, (err, resEmp) => {
        const empList = [];
        resEmp.forEach(({first_name, last_name, id}) => {
            empList.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

    db.query(`SELECT * FROM roles`, (err, resRoles) => {
        const roleList = [];
        resRoles.forEach(({title, id}) => {
            roleList.push({
                name: title,
                value: id
            });
        });

        inquirer.prompt([
            {
                type: 'list', 
                name: 'employee', 
                message: "Which employee do you want to change roles?",
                choices: empList
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What do you want to change their role to?",
                choices: roleList
            }
        ])
        .then(answer => {
            db.query(`UPDATE employee SET ? WHERE ?? = ?;`, [{role_id: answer.role_id},  answer.employee], (err, results) => {
                console.log("Employee's role has been updated.");
                viewEmployees();
            })
        })
    })
    })
}