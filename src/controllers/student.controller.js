const { students, getNextId } = require('../db');
const { createStudent } = require('../models/student.model');

/**
 * GET /api/students
 * Returns all students.
 */
const getAllStudents = (req, res) => {
    res.status(200).json({
        success: true,
        count: students.length,
        data: students,
    });
};

/**
 * GET /api/students/:id
 * Returns a single student by ID.
 */
const getStudentById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const student = students.find((s) => s.id === id);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: `Student with id ${id} not found`,
        });
    }

    res.status(200).json({
        success: true,
        data: student,
    });
};

/**
 * POST /api/students
 * Creates a new student and adds it to the in-memory store.
 */
const createStudentHandler = (req, res) => {
    const { name, age, grade, email } = req.body;

    // Basic validation
    if (!name || !age || !grade || !email) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, age, grade, email',
        });
    }

    const newStudent = createStudent({
        id: getNextId(),
        name,
        age,
        grade,
        email,
    });

    students.push(newStudent);

    res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent,
    });
};

/**
 * PUT /api/students/:id
 * Replaces all fields of an existing student by ID.
 */
const updateStudent = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with id ${id} not found`,
        });
    }

    const { name, age, grade, email } = req.body;

    if (!name || !age || !grade || !email) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, age, grade, email',
        });
    }

    const updatedStudent = createStudent({ id, name, age, grade, email });
    students[index] = updatedStudent;

    res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent,
    });
};

/**
 * DELETE /api/students/:id
 * Removes a student from the in-memory store by ID.
 */
const deleteStudent = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Student with id ${id} not found`,
        });
    }

    const deleted = students.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: `Student with id ${id} deleted successfully`,
        data: deleted,
    });
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudentHandler,
    updateStudent,
    deleteStudent,
};
