import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { AuthService } from "./email-and-password-auth.service";

import {
  CreateLoginDto,
  CreateOTPDto,
  CreateSignupDto,
  login,
  otp,
  resendOtp,
  ResendOTPDto,
  signup,
} from "./validation";
import { ZodPipe } from "src/utils/schema-validation/validation.pipe";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @UsePipes(new ZodPipe(signup))
  SignUp(@Body() dto: CreateSignupDto) {
    return this.authService.signup(dto);
  }

  @Post("/login")
  @UsePipes(new ZodPipe(login))
  Login(@Body() dto: CreateLoginDto) {
    return this.authService.login(dto);
  }

  @Post("/validateOTP")
  @UsePipes(new ZodPipe(otp))
  ValidateOTP(@Body() dto: CreateOTPDto) {
    return this.authService.validateOTP(dto);
  }

  @Post("/resendOTP")
  @UsePipes(new ZodPipe(resendOtp))
  resendOTP(@Body() dto: ResendOTPDto) {
    return this.authService.resendOTP(dto);
  }
}
