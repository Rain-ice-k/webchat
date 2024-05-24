import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function TopNav() {
  const session = await auth();
  return (
    <Navbar
      maxWidth="xl"
      className="bg-gradient-to-r from-blue-400 to-blue-700"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-green-200",
        ],
      }}
    >
      <NavbarBrand as={Link} href='/'>
        <GiMatchTip size={40} className="text-gray-200"/>
        <div className="font-bold text-3xl flex">
          <span className="text-gray-900">Ice</span>
          <span className="text-gray-200">chat</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavLink href="/members" label="主页" />
        <NavLink href="/lists" label="列表" />
        <NavLink href="/messages" label="消息" />
      </NavbarContent>
      <NavbarContent justify="end">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Button
              as={Link}
              href="/login"
              variant="bordered"
              className="text-white"
            >
              登录
            </Button>
            <Button
              as={Link}
              href="/register"
              variant="bordered"
              className="text-white"
            >
              注册
            </Button>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
