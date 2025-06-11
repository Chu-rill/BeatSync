import { UserRepository } from "../repository/user.repository.js";
import bcrypt from "bcryptjs";

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData) {
    try {
      // Check if user already exists
      const existingEmail = await this.userRepository.findUserByEmail(
        userData.email
      );
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      const existingUsername = await this.userRepository.findUserByUsername(
        userData.username
      );
      if (existingUsername) {
        throw new Error("Username already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user with hashed password
      const user = await this.userRepository.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error in createUser service: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Return user without password
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error in login service: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error in getUserById service: ${error.message}`);
    }
  }

  async updateUser(id, updateData) {
    try {
      // Hash password if it's being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      const user = await this.userRepository.updateUser(id, updateData);
      if (!user) {
        throw new Error("User not found");
      }

      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error in updateUser service: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.userRepository.deleteUser(id);
      if (!user) {
        throw new Error("User not found");
      }
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error(`Error in deleteUser service: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.getAllUsers();
      return users.map((user) => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error(`Error in getAllUsers service: ${error.message}`);
    }
  }
}
