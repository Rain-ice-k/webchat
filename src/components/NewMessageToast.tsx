import { MessageDto } from '@/types'
import Link from 'next/link'
import React from 'react'
import {Image} from '@nextui-org/react';
import { transformImageUrl } from '@/lib/util';
import { toast } from 'react-toastify';

type Props = {
    message: MessageDto
}

export default function NewMessageToast({message}: Props) {
  return (
    <Link href={`/members/${message.senderId}/chat`} className='flex items-center'>
        <div className='mr-2'>
            <Image 
                src={transformImageUrl(message.senderImage) || '/images/user.png'}
                height={50}
                width={50}
                alt='发件人图片'
            />
        </div>
        <div className='flex flex-grow flex-col justify-center'>
            <div className='font-semibold'>{message.senderName} 发给了你一条消息</div>
            <div className='text-sm'>去查看</div>
        </div>
    </Link>
  )
}
export const newMessageToast = (message: MessageDto) => {
    toast(<NewMessageToast message={message} />)
}