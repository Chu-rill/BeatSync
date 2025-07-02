import { Module } from '@nestjs/common';
import { AuthController } from './email-and-password-auth.controller';
import { UserModule } from 'src/user/user.module';
// import { HashService } from './';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/infra/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    MailModule,
  ],
})
export class EmailAndPasswordAuthModule {}
