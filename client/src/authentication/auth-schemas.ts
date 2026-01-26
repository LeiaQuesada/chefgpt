import { z } from 'zod'
// User type and schema for authentication
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
})
export type User = z.infer<typeof UserSchema>

// Login credentials schema
export const LoginCredentialsSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
})

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>

// Signup data schema
export const SignupDataSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    image_url: z.url().or(z.literal('')).nullable().optional(),
})

export type SignupData = z.infer<typeof SignupDataSchema>

// Signup form schema (includes password confirmation)
export const SignupFormSchema = z
    .object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        image_url: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type SignupForm = z.infer<typeof SignupFormSchema>

// Auth result schema
export const AuthResultSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
})

export type AuthResult = z.infer<typeof AuthResultSchema>
