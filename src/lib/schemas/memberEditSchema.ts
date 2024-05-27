import {z} from 'zod'

export const memberEditSchema = z.object({
    name:z.string().min(1, {
        message: '姓名不能为空'
    }),
    description: z.string().min(1, {
        message: '描述不能为空'
    }),
    city: z.string().min(1, {
        message: '城市不能为空'
    }),
    country:z.string().min(1, {
        message:'国家不能为空'
    })
})

export type MemberEditSchema = z.infer<typeof memberEditSchema>