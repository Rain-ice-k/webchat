import {z} from 'zod'

export const loginSchema = z.object({
  email:z.string().email({message:'无效的邮箱'}),
  password: z.string().min(6, {
    message: '密码至少为6位'
  })
})

export type LoginSchema = z.infer<typeof loginSchema>