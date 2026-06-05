const User = require('../models/user.model');

class UserService {
    static async getUsers() {
        return await User.find();
    }

    static async getUserById(id) {
        return await User.findById(id);
    }

    static async createUser(data) {
        const user = await User.create({
            name: data.name,
            email: data.email,
            phone: data.phone
        });

        return user;
    }

    static async updateUser(id, data) {
        return await User.findByIdAndUpdate(
            id,
            {
                name: data.name,
                email: data.email,
                phone: data.phone
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
    }

    static async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = UserService;