import {z} from 'zod';

export const messageSchema = z.object({
    text: z.string().min(1, {
        message: '需要输入内容'
    })
})

export type MessageSchema = z.infer<typeof messageSchema>