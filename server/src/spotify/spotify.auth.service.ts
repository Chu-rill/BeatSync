import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as querystring from 'querystring';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SpotifyAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly frontendUrl: string;
  private readonly userService: UserService;
  private readonly jwt: JwtService;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID')!;
    this.clientSecret = this.configService.get<string>(
      'SPOTIFY_CLIENT_SECRET',
    )!;
    this.redirectUri = this.configService.get<string>('SPOTIFY_REDIRECT_URI')!;
    this.frontendUrl = this.configService.get<string>('SPOTIFY_FRONTEND_URL')!;

    // Validate required environment variables
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Missing required Spotify configuration');
    }
  }

  getAuthorizationUrl(state: string): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' ');

    const params = querystring.stringify({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
      state,
    });

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    if (!code) {
      throw new BadRequestException('Authorization code is required');
    }

    const authHeader = this.getBasicAuthHeader();

    const requestData = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams(requestData),
          {
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      if (!response.data.access_token) {
        throw new InternalServerErrorException(
          'No access token received from Spotify',
        );
      }

      return response.data.access_token;
    } catch (error) {
      console.error(
        'Token exchange error:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to exchange authorization code for access token',
      );
    }
  }

  private getBasicAuthHeader(): string {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');
    return `Basic ${credentials}`;
  }

  getFrontendRedirectUrl(accessToken: string): string {
    return `${this.frontendUrl}?access_token=${accessToken}`;
  }

  async getSpotifyProfile(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      console.error(
        'Failed to fetch Spotify profile:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Could not fetch Spotify profile');
    }
  }
}
