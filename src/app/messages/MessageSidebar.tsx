'use client'
import useMessageStore from '@/hooks/useMessageStore';
import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react'
import {GoInbox} from 'react-icons/go';
import {MdOutlineOutbox} from 'react-icons/md';
export default function MessageSidebar() {
    const { unreadCount } = useMessageStore((state) => ({
        unreadCount: state.unreadCount,
      }));
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [selected, setSelected] = useState<string>(searchParams.get('container') || 'inbox');
    const items = [
        {key: 'inbox', label: '收件箱', icon: GoInbox, chip: true},
        {key: 'outbox', label: '发件箱', icon: MdOutlineOutbox, chip: false},
    ]
    const handleSelect = (key: string) => {
        setSelected(key);
        const params = new URLSearchParams();
        params.set('container', key);
        router.replace(`${pathname}?${params}`)
    }
    return (
        <div className='flex flex-col shadow-md rounded-lg cursor-pointer'>
            {items.map(({key, icon: Icon, label, chip}) => (
                <div key={key}
                    className={clsx('flex flex-row items-center rounded-t-lg gap-2 p-3', {
                        'text-primary font-semibold': selected === key,
                        'text-black hover:text-primary/70': selected !== key
                    })}
                    onClick={() => handleSelect(key)}
                > 
                    <Icon size={24} />
                    <div className='flex justify-between flex-grow'>
                        <span>{label}</span>
                        {chip && <Chip>{unreadCount}</Chip>}
                    </div>
                </div>
            ))}
        </div>
    )
}