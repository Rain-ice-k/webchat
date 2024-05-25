import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center vertical-center">
        <Spinner label="加载中" color="primary" labelColor="primary"/>
    </div>
  )
}