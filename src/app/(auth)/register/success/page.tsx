'use client';

import CardWrapper from '@/components/CardWrapper';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function RegisterSuccessPage() {
    const router = useRouter();

    return (
        <CardWrapper 
            headerText='你已经成功注册'
            subHeaderText='请在登录前验证你的邮箱'
            action={() => router.push('/login')}
            actionLabel='去登录'
            headerIcon={FaCheckCircle}
        />
    )
}