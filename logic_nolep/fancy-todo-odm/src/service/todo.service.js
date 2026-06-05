const Todo = require('../models/todo.model');

class TodoService {
    static async getTodos() {
        return await Todo.find().populate('userId', 'name email phone');
    }

    static async getTodoById(id) {
        return await Todo.findById(id).populate('userId', 'name email phone');
    }

    static async createTodo(data) {
        const todo = await Todo.create({
            title: data.title,
            description: data.description,
            status: data.status || 'pending',
            userId: data.userId
        });

        return todo;
    }

    static async updateTodo(id, data) {
        return await Todo.findByIdAndUpdate(
            id,
            {
                title: data.title,
                description: data.description,
                status: data.status,
                userId: data.userId
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
    }

    static async deleteTodo(id) {
        return await Todo.findByIdAndDelete(id);
    }
}

module.exports = TodoService;