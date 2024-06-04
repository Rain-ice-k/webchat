import { auth } from '@/auth';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { GiMatchTip } from 'react-icons/gi';

export default async function Home() {
  const session = await auth();

  return (
    <div className='flex flex-col justify-center items-center mt-20 gap-6 text-primary'>
      <GiMatchTip size={100} />
      <h1 className='text-4xl font-bold'>欢迎来到聊天室</h1>
      {session ? (
        <Button
          as={Link}
          href='/members'
          size='lg'
          color='primary'
          variant='bordered'
        >
          继续
        </Button>
      ) : (
        <div className='flex flex-row gap-4'>
          <Button
            as={Link}
            href='/login'
            size='lg'
            color='primary'
            variant='bordered'
          >
            登录
          </Button>
          <Button
            as={Link}
            href='/register'
            size='lg'
            color='primary'
            variant='bordered'
          >
            注册
          </Button>
        </div>
      )}
    </div>
  );
}