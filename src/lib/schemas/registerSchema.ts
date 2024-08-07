import {z} from 'zod';
import { calculateAge } from '../util';

export const registerSchema = z.object({
    name: z.string().min(2,{
        message: '姓名不能为空'
    }),
    email: z.string().email({
        message:'无效的邮箱'
    }),
    password: z.string().min(6, {
        message: '密码至少要6位'
    })
})

export const profileSchema = z.object({
    gender: z.string().min(1),
    description: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    dateOfBirth: z.string().min(1, {
        message: '生日不能为空'
    }).refine(dateString => {
        const age = calculateAge(new Date(dateString));
        return age >= 18;
    }, {
        message: '你需要满18岁才能使用该应用'
    }),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;

export type RegisterSchema = z.infer<typeof registerSchema & typeof profileSchema> 