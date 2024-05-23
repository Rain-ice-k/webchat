import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";

export default function TopNav() {
  return (
    <Navbar
      maxWidth="xl"
      className="bg-gradient-to-r from-blue-400 to-blue-700"
      classNames={{
        item:[
          'text-xl',
          'text-white',
          'uppercase',
          'data-[active=true]:text-green-200'
        ]
      }}
    >
      <NavbarBrand>
        <GiMatchTip size={40} />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-900">Next</span>
          <span className="text-gray-200">Match</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavLink href="/members" label="Matches" />
        <NavLink href="/lists" label="Lists" />
        <NavLink href="/messages" label="Messages" />
         </NavbarContent>
      <NavbarContent justify="end">
        <Button as={Link} href='/login' variant="bordered" className="text-white">Login</Button>
        <Button as={Link} href='/register' variant="bordered" className="text-white">Register</Button>
      </NavbarContent>
    </Navbar>
  );
}
