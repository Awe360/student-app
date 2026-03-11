const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getStudentById,
    createStudentHandler,
    updateStudent,
    deleteStudent,
} = require('../controllers/student.controller');

// GET    /api/students        - Get all students
// GET    /api/students/:id    - Get student by ID
// POST   /api/students        - Create new student
// PUT    /api/students/:id    - Update student by ID (full update)
// DELETE /api/students/:id    - Delete student by ID

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudentHandler);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
