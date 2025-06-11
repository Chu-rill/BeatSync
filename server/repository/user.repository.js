import User from '../model/user.model.js';

export class UserRepository {
    async createUser(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async findUserByUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }

    async updateUser(id, updateData) {
        try {
            return await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async getAllUsers() {
        try {
            return await User.find({});
        } catch (error) {
            throw new Error(`Error fetching all users: ${error.message}`);
        }
    }
}