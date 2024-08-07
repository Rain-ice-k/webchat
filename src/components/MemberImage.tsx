'use client';

import { Photo } from '@prisma/client'
import { CldImage } from 'next-cloudinary';
import { Button, Image, useDisclosure} from '@nextui-org/react';
import clsx from 'clsx';
import { useRole } from '@/hooks/useRole';
 import {ImCheckmark, ImCross} from 'react-icons/im'
import { useRouter } from 'next/navigation';
import { approvePhoto, rejectPhoto } from '@/app/actions/adminAction';
import { toast } from 'react-toastify';
type Props = {
    photo: Photo | null;
}

export default function MemberImage({ photo }: Props) {
    const role = useRole()
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!photo) return null

    const approve = async (photoId: string) => {
        try {
            await approvePhoto(photoId)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)   
        }
    }
    const reject = async (photo: Photo) => {
        try {
            await rejectPhoto(photo)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)   
        }
    }
    return (
        <div className='cursor-pointer' onClick={onOpen}>
            {photo?.publicId ? (
                <CldImage
                    alt='用户图像'
                    src={photo.publicId}
                    width={300}
                    height={300}
                    crop='fill'
                    gravity='faces'
                    className={clsx('rounded-2xl',{
                        'opacity-40': !photo.isApproved && role !== 'ADMIN'
                    })}
                />
            ) : (
                <Image
                    width={220}
                    height={220}
                    src={photo?.url || '/images/user.png'}
                    alt='用户图片'
                />
            )}
            {!photo?.isApproved && role!=='ADMIN'&&(
                <div className='absolute bottom-2 w-full bg-slate-200 p-1'>
                    <div className='flex justify-center text-danger font-semibold'>
                        正在等待审核
                    </div>
                </div>
            )}
            {role ==='ADMIN' && (
                <div className='flex flex-row gap-2 mt-2'>
                    <Button onClick={() => approve(photo.id)} color='success' variant='bordered' fullWidth>
                        <ImCheckmark size={20} />
                    </Button>
                    <Button onClick={()=>reject(photo)} color='danger' variant='bordered' fullWidth>
                        <ImCross size={20} />
                    </Button>
                </div>
            )}
        </div>
    )
}