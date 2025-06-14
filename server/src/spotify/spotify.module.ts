import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SpotifyAuthService } from './spotify.auth.service';
import { SpotifyAuthController } from './spotify.auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [SpotifyAuthController],
  providers: [SpotifyAuthService],
  exports: [SpotifyAuthService],
})
export class SpotifyModule {}
