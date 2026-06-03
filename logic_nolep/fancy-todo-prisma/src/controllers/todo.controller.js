import * as todoService from '../service/todo.service.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(Number(req.params.id));
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await todoService.updateTodo(Number(req.params.id), req.body);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
