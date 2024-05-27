import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@nextui-org/react";
import { getAuthUserId } from "@/app/actions/authActions";

export default async function layout({children,}: {children: ReactNode}) {
  const userId = await getAuthUserId()
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();
  const basePath = `/members/edit`;
  const navLinks = [
    { name: "编辑简介", href: `${basePath}` },
    { name: "更新图片", href: `${basePath}/photos` },
  ];
  return (
    <div className="-mt-20 grid grid-cols-12 gap-5 h-[80vh]">
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
