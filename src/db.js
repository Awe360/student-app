/**
 * In-Memory Database
 * Acts as a simple in-memory store for student records.
 * Data resets on every server restart.
 */

let students = [
  {
    id: 1,
    name: 'Alice Johnson',
    age: 20,
    grade: 'A',
    email: 'alice.johnson@university.edu',
  },
  {
    id: 2,
    name: 'Bob Smith',
    age: 22,
    grade: 'B+',
    email: 'bob.smith@university.edu',
  },
  {
    id: 3,
    name: 'Carol Williams',
    age: 21,
    grade: 'A-',
    email: 'carol.williams@university.edu',
  },
  {
    id: 4,
    name: 'David Brown',
    age: 23,
    grade: 'C+',
    email: 'david.brown@university.edu',
  },
  {
    id: 5,
    name: 'Eva Martinez',
    age: 19,
    grade: 'A+',
    email: 'eva.martinez@university.edu',
  },
];

// Simple auto-increment counter
let nextId = students.length + 1;

const getNextId = () => nextId++;

module.exports = { students, getNextId };
