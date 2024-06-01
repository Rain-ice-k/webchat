import Link from 'next/link';
import React from 'react'
import {Image} from '@nextui-org/react';
import { transformImageUrl } from '@/lib/util';
import { MessageDto } from '@/types';
import { toast } from 'react-toastify';

type Props = {
    image?: string | null;
    href: string;
    title: string;
    subtitle?: string; 
}

export default function NotificationToast({image, href, title, subtitle}: Props) {
  return (
    <Link href={href} className='flex items-center'>
        <div className='mr-2'>
            <Image 
                src={transformImageUrl(image) || '/images/user.png'}
                height={50}
                width={50}
                alt='发件人图片'
            />
        </div>
        <div className='flex flex-grow flex-col justify-center'>
            <div className='font-semibold'>{title}</div>
            <div className='text-sm'>{subtitle || 'Click to view'}</div>
        </div>
    </Link>
  )
}

export const newMessageToast = (message: MessageDto) => {
    toast(
        <NotificationToast 
            image={message.senderImage}
            href={`/members/${message.senderId}/chat`}
            title={`${message.senderName} 发给你了条新消息`}
        />
    )
}

export const newLikeToast = (name: string, image: string | null, userId: string) => {
    toast(
        <NotificationToast 
            image={image}
            href={`/members/${userId}`}
            title={`你被 ${name}关注了`}
            subtitle='点击去看他'
        />
    )
}