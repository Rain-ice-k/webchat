import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@nextui-org/react";

export default async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { userId: string };
}) {
  const member = await getMemberByUserId(params.userId);
  const basePath = `/members/${member?.userId}`;
    const navLinks = [
    { name: "个人简介", href: `${basePath}` },
    { name: "图片", href: `${basePath}/photos` },
    { name: "聊天", href: `${basePath}/chat` },
  ];
  if (!member) return notFound();
  return (
    <div className="grid -mt-20 grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks}/>
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
            {children}
        </Card>
      </div>
    </div>
  );
}
