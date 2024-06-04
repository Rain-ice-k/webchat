import AppModal from '@/components/AppModal';
import PresenceAvatar from '@/components/PresenceAvatar';
import { truncateString } from '@/lib/util';
import { MessageDto } from '@/types'
import { Button, ButtonProps, useDisclosure } from '@nextui-org/react';
import React from 'react'
import { AiFillDelete } from 'react-icons/ai';

type Props = {
    item: MessageDto;
    columnKey: string;
    isOutbox: boolean;
    deleteMessage: (message: MessageDto) => void;
    isDeleting: boolean;
}

export default function MessageTableCell({ item, columnKey, isOutbox, deleteMessage, isDeleting }: Props) {
    const cellValue = item[columnKey as keyof MessageDto];
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onConfirmDeleteMessage = () => {
        deleteMessage(item);
    }

    const footerButtons: ButtonProps[] = [
        {color: 'default', onClick: onClose, children: '取消'},
        {color: 'primary', onClick: onConfirmDeleteMessage, children: '确定'},
    ];

    switch (columnKey) {
        case 'recipientName':
        case 'senderName':
            return (
                <div className='flex items-center gap-2 cursor-pointer'>
                    <PresenceAvatar
                        userId={isOutbox ? item.recipientId : item.senderId}
                        src={isOutbox ? item.recipientImage : item.senderImage}
                    />
                    <span>{cellValue}</span>
                </div>
            )
        case 'text':
            return (
                <div>
                    {truncateString(cellValue, 80)}
                </div>
            )
        case 'created':
            return <div>{cellValue}</div>
        default:
            return (
                <>
                    <Button
                        isIconOnly variant='light'
                        onClick={() => onOpen()}
                        isLoading={isDeleting}
                    >
                        <AiFillDelete size={24} className='text-danger' />
                    </Button>
                    <AppModal 
                        isOpen={isOpen}
                        onClose={onClose}
                        header='请确认'
                        body={<div>
                            你确定要删除这条消息么？这是不可逆的。
                        </div>}
                        footerButtons={footerButtons}
                    />
                </>

            )
    }
}