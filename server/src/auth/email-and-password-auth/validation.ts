import { z } from 'zod';

// signup validator schema
export const signup = z.object({
  name: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  email: z.string().email({ message: 'Invalid email format' }),
});

export type CreateSignupDto = z.infer<typeof signup>;

export const signupOauth = z.object({
  name: z.string().min(1, { message: 'Username is required' }),
  password: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }),
});

export type CreateSignupOauthDto = z.infer<typeof signupOauth>;

// Login validator schema
export const login = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type CreateLoginDto = z.infer<typeof login>;

// Update User validator schema
export const updateUserValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdateUserValidationDto = z.infer<typeof updateUserValidation>;
