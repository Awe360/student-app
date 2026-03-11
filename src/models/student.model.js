/**
 * Student Model
 * Factory function that creates a validated student object.
 */

const createStudent = ({ id, name, age, grade, email }) => ({
    id,
    name,
    age: Number(age),
    grade,
    email,
});

module.exports = { createStudent };
