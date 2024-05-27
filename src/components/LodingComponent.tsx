import { Spinner } from "@nextui-org/react";

export default function LodingComponent({label}:{label?:string}) {
  return (
   <div className="fixed inset-0 flex justify-center items-center">
        <Spinner
            label={label||'加载中'}
            color='primary'
            labelColor='primary'/>
    </div>
  )
}