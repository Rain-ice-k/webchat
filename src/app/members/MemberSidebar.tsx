'use client'
import PresenceDot from "@/components/PresenceDot";
import { calculateAge } from "@/lib/util";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  member: Member;
  navLinks: {name:string, href:string}[]
};
export default function MemberSidebar({ member, navLinks}: Props) {
    const pathname = usePathname()
  const basePath = `/members/${member.userId}`;
  return (
    <Card className="w-full mt-10 items-center h-[80vh">
      <Image
        height={200}
        width={200}
        src={member.image || "/images/user.png"}
        alt="用户简介图像"
        className="rounded-full mt-6 aspect-square object-cover"
      />
      <CardBody className='overflow-hidden'>
        <div className="flex flex-col items-center">
        <div className="flex">
        <div className="text-2xl">
            {member.name}, {calculateAge(member.dateOfBirth)}
          </div>
          <div>
            <PresenceDot member={member}/>
          </div>
        </div>


          <div className="text-sm text-neutral-500">
            {member.city}, {member.country}
          </div>
        </div>
        <Divider className="my-3" />
        <nav className="flex flex-col p-4 ml-4 text-2xl gap-4">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className={`block rounded ${
                pathname === link.href
                  ? "text-primary"
                  : "hover:text-primary/50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </CardBody>
      <CardFooter className="-mt-5">
        <Button
          as={Link}
          href="/members"
          fullWidth
          color="primary"
          variant="bordered"
        >
          返回
        </Button>
      </CardFooter>
    </Card>
  );
}
