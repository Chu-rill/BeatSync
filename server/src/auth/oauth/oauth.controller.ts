import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from './oauth.service';
import { GoogleGuard } from 'src/guard/google.guard';
import { ConfigService } from '@nestjs/config';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req) {
    // This triggers the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.oauthService.validateOAuthGoogleLogin(req);

    const redirectUrl = `${this.configService.get<string>(
      'FRONTEND_REDIRECT_URL',
    )}?token=${result.token}`;

    return res.redirect(redirectUrl);
  }
}
