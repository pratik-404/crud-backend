const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const cors = require('cors');

router.use(cors());


// POST route to create a new employee
router.post('/', async (req, res) => {
    console.log("Attempting to create a new employee with data:", req.body);
    try {
        const employee = new Employee(req.body);
        await employee.save();
        console.log("Employee created successfully:", employee);
        res.status(201).send(employee);
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(400).send(error);
    }
});

// GET route to fetch all employees
router.get('/', async (req, res) => {
    console.log("Fetching all employees...");
    try {
        const employees = await Employee.find({});
        console.log("Fetched employees:", employees);
        res.send(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).send();
    }
});

// GET route to fetch a specific employee by ID
router.get('/:id', async (req, res) => {
    console.log(`Fetching employee with ID: ${req.params.id}`);
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            console.warn(`No employee found with ID: ${req.params.id}`);
            return res.status(404).send();
        }
        console.log("Fetched employee:", employee);
        res.send(employee);
    } catch (error) {
        console.error(`Error fetching employee with ID: ${req.params.id}`, error);
        res.status(500).send();
    }
});

// PUT route to update a specific employee by ID
router.put('/:id', async (req, res) => {
    console.log(`Attempting to update employee with ID: ${req.params.id} with data:`, req.body);
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            console.warn(`No employee found with ID: ${req.params.id}`);
            return res.status(404).send();
        }

        // Define the fields that can be updated
        const updates = ['name', 'email', 'department', 'position'];
        
        // Update the employee object with new data if provided in the request body
        updates.forEach(update => {
            if (req.body[update]) {
                employee[update] = req.body[update];
            }
        });

        await employee.save();
        console.log("Employee updated successfully:", employee);
        res.send(employee);
    } catch (error) {
        console.error(`Error updating employee with ID: ${req.params.id}`, error);
        res.status(400).send(error);
    }
});


// DELETE route to delete a specific employee by ID
router.delete('/:id', auth, admin, async (req, res) => {
    console.log(`Attempting to delete employee with ID: ${req.params.id}`);
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            console.warn(`No employee found with ID: ${req.params.id}`);
            return res.status(404).send();
        }
        console.log("Employee deleted successfully:", employee);
        res.send(employee);
    } catch (error) {
        console.error(`Error deleting employee with ID: ${req.params.id}`, error);
        res.status(500).send();
    }
});

module.exports = router;
