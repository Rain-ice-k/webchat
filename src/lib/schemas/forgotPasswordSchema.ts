import {z} from 'zod'

export const resetPasswordSchema = z.object({
    password: z.string().min(6, {
        message: '密码需至少6位'
    }),
    confirmPassword: z.string().min(6)
}).refine(data => data.password === data.confirmPassword,{
    message: '密码不匹配',
    path: ['confirmPassword']
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>