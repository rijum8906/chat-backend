import { z } from 'zod';

// --------------------------
// Zod Login Validator
// --------------------------
export const loginValidator = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    username: z
      .string()
      .regex(/^[a-z0-9_]+$/, {
        message: 'Username must be lowercase alphanumeric with underscores only'
      })
      .min(3)
      .max(30)
      .optional(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
  })
  .refine((data) => data.email || data.username, {
    message: 'Either email or username is required',
    path: ['email']
  });

// --------------------------
// LoginPayload Interface
// --------------------------
export type LoginPayload = z.infer<typeof loginValidator>;

// --------------------------
// Zod Register Validator
// --------------------------
export const registerValidator = z.object({
  firstName: z.string().min(3).max(15),
  lastName: z.string().min(3).max(15),
  email: z.string().email().toLowerCase(),
  username: z.string().min(4).toLowerCase(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

// --------------------------
// RegisterPayload Interface
// --------------------------
export type RegisterPayload = z.infer<typeof registerValidator>;
