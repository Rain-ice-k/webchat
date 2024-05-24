import {z} from 'zod'

export const registerSchema = z.object({
  name:z.string(),
  email:z.string().email({message:'无效的邮箱'}),
  password: z.string().min(6, {
    message: '密码至少为6位'
  })
})

export type RegisterSchema = z.infer<typeof registerSchema>