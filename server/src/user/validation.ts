import { z } from "zod";

// deleteUserValidation validator schema
export const deleteUserValidation = z.object({
  id: z.string().cuid(),
});

export const getUserValidation = z.object({
  id: z.string().cuid(),
});

// uploadProfile validator schema
export const uploadProfile = z.object({
  profile: z.string(),
});

// updateUserValidation validator schema
export const updateUserValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
});
