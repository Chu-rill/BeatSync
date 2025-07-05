import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { AuthRequest } from 'src/types/auth.request';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwt.verifyAsync(token);
      const user = await this.userModel.findById(payload.id).lean();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // if (!user.isVerified) {
      //   throw new UnauthorizedException('Access denied. User not verified');
      // }
      // if (user.role !== 'ADMIN') {
      //   throw new UnauthorizedException('Access denied. Admins only.');
      // }
      request.user = { id: user._id.toString() };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
