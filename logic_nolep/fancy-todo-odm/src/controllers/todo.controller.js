const todoService = require('../service/todo.service');

const getTodos = async (req, res) => {
    try {
        const todos = await todoService.getTodos();

        res.status(200).json({
            success: true,
            data: todos
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTodoById = async (req, res) => {
    try {
        const todo = await todoService.getTodoById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const createTodo = async (req, res) => {
    try {
        const todo = await todoService.createTodo(req.body);

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: todo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateTodo = async (req, res) => {
    try {
        const todo = await todoService.updateTodo(req.params.id, req.body);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const todo = await todoService.deleteTodo(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
            data: todo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};