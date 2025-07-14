import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
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

  //connect for YouTube music
  @Get('google/connect')
  @UseGuards(GoogleGuard)
  async connectGoogle(@Req() req, @Res() res: Response) {
    const authUrl = await this.oauthService.getGoogleConnectUrl(req.user);
    res.redirect(authUrl);
  }

  @Get('google/connect/callback')
  @UseGuards(GoogleGuard)
  async connectGoogleCallback(
    @Query('state') state: string,
    @Req() req,
    @Res() res: Response,
  ) {
    await this.oauthService.handleGoogleConnect(req, state);

    const redirectUrl = `${this.configService.get<string>(
      'FRONTEND_REDIRECT_URL',
    )}?googleConnected=true`;

    return res.redirect(redirectUrl);
  }
}
