const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    department: String,
    position: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
