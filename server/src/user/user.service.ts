// users/users.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import {
  CreateLoginDto,
  CreateSignupDto,
  CreateSignupOauthDto,
} from 'src/auth/email-and-password-auth/validation';
import { LoginResponse, SignUpResponse } from './user.response';
import {
  comparePassword,
  encrypt,
} from 'src/utils/helper-functions/encryption';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/infra/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  async create(dto: CreateSignupDto): Promise<SignUpResponse> {
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
    const newUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    try {
      const data = {
        subject: 'BeatSync Inviation',
        username: user.name,
      };
      await this.mailService.sendWelcomeEmail(user.email, data);
    } catch (error) {
      console.log('Failed to send welcome email:', error);
    }
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

  async createOauth(dto: CreateSignupOauthDto): Promise<User> {
    const newUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: '',
    });
    const user = await newUser.save();

    return user;
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
  async findUnique(unique: {
    email?: string;
    _id?: string;
    name?: string;
  }): Promise<User | null> {
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
  async login(dto: CreateLoginDto): Promise<LoginResponse> {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user)
      return {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        data: null,
        token: '',
      };
    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'invalid password',
        data: null,
        token: '',
      };
    }
    let { password: userPassword, ...userWithoutPassword } = user;
    const payload = {
      ...userWithoutPassword, // Spread the rest of the user properties
    };
    const token = await this.jwt.signAsync(payload);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    };
  }
}
