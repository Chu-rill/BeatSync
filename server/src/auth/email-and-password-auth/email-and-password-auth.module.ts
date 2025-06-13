import { Module } from '@nestjs/common';
import { AuthService } from './email-and-password-auth.service';
import { AuthController } from './email-and-password-auth.controller';
import { UserModule } from 'src/user/user.module';
// import { HashService } from './';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infra/db/database.module';
import { OtpModule } from 'src/otp/otp.module';
import { MailModule } from 'src/infra/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    OtpModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    DatabaseModule,
    MailModule,
  ],
})
export class EmailAndPasswordAuthModule {}
