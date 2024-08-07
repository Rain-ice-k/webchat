import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function EmptyState() {
  return (
    <div className="flex justify-center items-center mt-20">
        <Card className="p-5">
            <CardHeader className="text-3xl text-primary">
                无结果
            </CardHeader>
            <CardBody className="text-center">
                请以另一种方式筛选
            </CardBody>
        </Card>

    </div>
  )
}