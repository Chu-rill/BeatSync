import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { SpotifyAuthService } from './spotify.auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Controller('auth/spotify')
export class SpotifyAuthController {
  private readonly logger = new Logger(SpotifyAuthController.name);

  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  login(@Res() res: Response): void {
    try {
      const authUrl = this.spotifyAuthService.getAuthorizationUrl();
      res.redirect(authUrl);
    } catch (error) {
      this.logger.error('Login error:', error);
      throw new InternalServerErrorException('Failed to initiate login');
    }
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (!code) {
        throw new BadRequestException('No authorization code provided');
      }

      // 1. Exchange code for token
      const accessToken =
        await this.spotifyAuthService.exchangeCodeForToken(code);

      // 2. Extract user ID from JWT (assume JWT is in cookie or header)
      const jwt =
        req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];
      if (!jwt) throw new UnauthorizedException('No JWT found');
      const payload = this.jwtService.verify(jwt);
      const userId = payload.id;

      // 3. Update user's connected services
      await this.userService.updateConnectedService(userId, 'spotify', true);

      // 4. Redirect to frontend
      const redirectUrl =
        this.spotifyAuthService.getFrontendRedirectUrl(accessToken);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error('Callback error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Authentication failed');
    }
  }
}
