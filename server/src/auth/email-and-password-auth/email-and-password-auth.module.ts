import { Module } from '@nestjs/common';
import { AuthController } from './email-and-password-auth.controller';
import { UserModule } from 'src/user/user.module';
// import { HashService } from './';

import { MailModule } from 'src/infra/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [UserModule, MailModule],
})
export class EmailAndPasswordAuthModule {}
