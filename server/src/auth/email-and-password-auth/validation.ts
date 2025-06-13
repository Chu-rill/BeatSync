import { z } from "zod";
import { Role } from "@generated/prisma";

const RoleEnum = z.nativeEnum(Role);

// signup validator schema
export const signup = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().optional(),
  role: RoleEnum.optional(),
});

export type CreateSignupDto = z.infer<typeof signup>;

// Login validator schema
export const login = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type CreateLoginDto = z.infer<typeof login>;

// OTP validator schema
export const otp = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  OTP: z.string().min(1, { message: "OTP is required" }),
});

export type CreateOTPDto = z.infer<typeof otp>;

// Resend OTP validator schema
export const resendOtp = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export type ResendOTPDto = z.infer<typeof resendOtp>;

// Update User validator schema
export const updateUserValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdateUserValidationDto = z.infer<typeof updateUserValidation>;
