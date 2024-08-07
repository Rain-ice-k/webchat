import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/useActions";
import FiltersWrapper from "./FiltersWrapper";

export default async function TopNav() {
  const session = await auth();
  const userInfo = session?.user && (await getUserInfoForNav());

  const memberLinks = [
    {href: '/members', label: '主页'},
    {href: '/lists', label: '列表'},
    {href: '/messages', label: '消息'}
  ]
  const adminLinks = [
    {href: '/admin/moderation', label: 'Photo Moderation'}
  ]

  const links = session?.user.role === 'ADMIN' ? adminLinks : memberLinks
  return (
    <>
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
        <NavbarBrand as={Link} href="/">
          <GiMatchTip size={40} className="text-gray-200" />
          <div className="font-bold text-3xl flex">
            <span className="text-gray-900">Ice</span>
            <span className="text-gray-200">chat</span>
          </div>
        </NavbarBrand>
        <NavbarContent justify="center">
          {session && links.map(item => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          {userInfo ? (
            <UserMenu userInfo={userInfo} />
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
      <FiltersWrapper />
    </>
  );
}
