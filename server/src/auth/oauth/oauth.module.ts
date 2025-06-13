import { Module } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthController } from "./oauth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";
import { MailModule } from "src/infra/mail/mail.module";

@Module({
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "2h" },
    }),
    PassportModule,
    MailModule,
  ],
  exports: [OauthService],
})
export class OauthModule {}
