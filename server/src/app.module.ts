import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { EmailAndPasswordAuthModule } from './auth/email-and-password-auth/email-and-password-auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './infra/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    SpotifyModule,
    OauthModule,
    EmailAndPasswordAuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
