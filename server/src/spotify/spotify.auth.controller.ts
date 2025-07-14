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
  login(@Query('state') state: string, @Res() res: Response): void {
    try {
      const authUrl = this.spotifyAuthService.getAuthorizationUrl(state);
      res.redirect(authUrl);
    } catch (error) {
      this.logger.error('Login error:', error);
      throw new InternalServerErrorException('Failed to initiate login');
    }
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (!code)
        throw new BadRequestException('No authorization code provided');
      if (!state) throw new UnauthorizedException('Missing OAuth state');

      // Here, verify the JWT token you sent from frontend
      const decoded = this.jwtService.decode(state);
      console.log(`Decoded token:`, decoded);
      const payload = this.jwtService.verify(state);
      const userId = payload.id; // or whatever field your token includes

      // Exchange code for token
      const accessToken =
        await this.spotifyAuthService.exchangeCodeForToken(code);

      // Fetch Spotify profile (optional)
      //    const profile =
      //  await this.spotifyAuthService.getSpotifyProfile(accessToken);

      // Update your user record
      await this.userService.updateConnectedService(userId, 'spotify', true);

      // Store tokens if you want
      // await this.userService.updateSpotifyTokens(
      //    userId,
      //   accessToken,
      //   refreshToken,
      //  );

      // Redirect to frontend
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
