import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/infra/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { CreateSignupOauthDto } from '../email-and-password-auth/validation';

@Injectable()
export class OauthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async validateOAuthGoogleLogin(req): Promise<any> {
    if (!req || !req.user) {
      console.log('Google login failed:', req);
      throw new UnauthorizedException('No user from Google');
    }

    const auth = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      picture: req.user.picture,
    };

    let user = await this.userService.findUnique({ email: auth.email });
    const dto: CreateSignupOauthDto = {
      name: auth.firstName + ' ' + auth.lastName,
      email: auth.email,
    };

    if (!user) {
      user = await this.userService.createOauth(dto);

      const data = {
        subject: 'BeatSync Inviation',
        username: user.name,
      };
      await this.mailService.sendWelcomeEmail(user.email, data);
    }

    const payload = { id: user.id, username: user.name, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'Google Auth Successful',
      data: user,
      token: token,
    };
  }

  //YouTube Music Connect
  async getGoogleConnectUrl(currentUser: any): Promise<string> {
    const state = await this.jwt.signAsync(
      { sub: currentUser.id },
      { expiresIn: '10m' },
    );

    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: process.env.GOOGLE_CONNECT_REDIRECT_URI || '',
      response_type: 'code',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube.readonly',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: state || '',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // New: Handle the callback and update the user
  async handleGoogleConnect(req, state: string) {
    if (!req || !req.user) {
      throw new UnauthorizedException('No user info from Google');
    }

    let payload: any;
    try {
      payload = this.jwt.verify(state);
    } catch {
      throw new UnauthorizedException('Invalid or expired state');
    }

    const userId = payload.sub;

    // Optionally store tokens if available (req.user.tokens)

    await this.userService.updateConnectedService(userId, 'google', true);
  }
}
