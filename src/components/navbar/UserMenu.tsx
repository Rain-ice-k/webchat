'use client'
import { signOutUser } from "@/app/actions/authActions"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react"
import { Session } from "next-auth"
import Link from "next/link"

type Props = {
    userInfo: {name: string | null; image: string | null;} | null
}
export default function UserMenu({userInfo}: Props) {
  return (
    <Dropdown placement="bottom-end">
        <DropdownTrigger>
            <Avatar
                isBordered
                as='button'
                className="transition-transform"
                color='primary'
                name={userInfo?.name ||'user avatar'}
                size='sm'
                src={userInfo?.image || '/images/user.png'}
            />
        </DropdownTrigger>
        <DropdownMenu variant="flat" aria-label="User action menu">
            <DropdownSection showDivider>
                <DropdownItem isReadOnly as='span' className="h-14 flex flex-row" aria-label="username">
                    {userInfo?.name}已登录
                </DropdownItem>
                </DropdownSection>
                <DropdownItem as={Link} href="/members/edit">
                    编辑个人简介
                </DropdownItem>
                <DropdownItem color='danger' onClick={async()=>signOutUser()}>
                    登出
                </DropdownItem>
        </DropdownMenu>
    </Dropdown>
  )
}