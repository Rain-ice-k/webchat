import { CardHeader, Divider, CardBody } from "@nextui-org/react";

export default function Chatpage() {
  return (
    <>
        <CardHeader className="text-2xl font-semibold text-primary">
            聊天
        </CardHeader>
        <Divider/>
        <CardBody>
          在这聊天
        </CardBody>
        </>
  )
}