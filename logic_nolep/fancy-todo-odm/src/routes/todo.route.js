const express = require('express');
const { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('../controllers/todo.controller');

const router = express.Router();

router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;