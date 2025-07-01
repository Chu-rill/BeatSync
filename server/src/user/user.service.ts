// users/users.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateSignupDto } from 'src/auth/email-and-password-auth/validation';
import { UserResponse } from './user.response';
import { encrypt } from 'src/utils/helper-functions/encryption';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto:CreateSignupDto): Promise<UserResponse> {
     // Check if user already exists
    const existingUser = await this.findUnique({ email: dto.email });
    if (existingUser) {
      return {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already exists',
        data: null,
      };
    }
    const hashedPassword = encrypt(dto.password); 
    const newUser = new this.userModel({ name: dto.name, email: dto.email, password: hashedPassword });
    const user = await newUser.save();
    return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'User signup successful',
        data: {
          id: (user as any)._id,
          name: user.name,
          email: user.email,
        },
      };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Find a user by a unique field (email, id, or username)
   * @param unique - An object with a unique field (e.g., { email })
   */
  /**
   * Find a user by a unique field (email, id, or name)
   * @param unique - An object with a unique field (e.g., { email })
   */
  async findUnique(unique: { email?: string; _id?: string; name?: string }): Promise<User | null> {
    // If _id is provided, convert to ObjectId
    const query: any = { ...unique };
    if (query._id) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mongoose = require('mongoose');
      query._id = new mongoose.Types.ObjectId(query._id);
    }
    return this.userModel.findOne(query).exec();
  }

  /**
   * Validate user credentials for login
   * @param email - User's email
   * @param password - User's password (plain text)
   * @returns The user if credentials are valid, otherwise null
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    // TODO: Replace with proper password hashing check
    // For now, compare plain text (not secure)
    if (user.password === password) {
      return user;
    }
    return null;
  }
}
