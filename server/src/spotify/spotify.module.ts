import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SpotifyAuthService } from './spotify.auth.service';
import { SpotifyAuthController } from './spotify.auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    UserModule,
  ],
  controllers: [SpotifyAuthController],
  providers: [SpotifyAuthService],
  exports: [SpotifyAuthService],
})
export class SpotifyModule {}
