import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { SpotifyAuthService } from './spotify.auth.service';

@Controller('auth/spotify')
export class SpotifyAuthController {
  private readonly logger = new Logger(SpotifyAuthController.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

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
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (!code) {
        throw new BadRequestException('No authorization code provided');
      }

      const accessToken =
        await this.spotifyAuthService.exchangeCodeForToken(code);
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
