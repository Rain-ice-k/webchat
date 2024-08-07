import { Spinner } from "@nextui-org/react";

export default function LodingComponent({label}:{label?:string}) {
  return (
   <div className="flex justify-center items-center vertical-center">
        <Spinner
            label={label||'加载中'}
            color='primary'
            labelColor='primary'/>
    </div>
  )
}