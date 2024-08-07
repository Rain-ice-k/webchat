import { verifyEmail } from "@/app/actions/authActions"
import CardWrapper from "@/components/CardWrapper"
import ResultMessage from "@/components/ResultMessage"
import { Spinner } from "@nextui-org/react"
import { MdOutlineMailOutline } from "react-icons/md"

export default async function VerifyEmailPage({searchParams}: {searchParams: {token: string}}) {
    const result = await verifyEmail(searchParams.token)
  return (
    <CardWrapper
    headerText="验证你的邮箱"
    headerIcon={MdOutlineMailOutline}
    body={
        <div className="flex flex-col space-y-4 items-center">
            <div className="flex flex-row items-center">
                <p>正在验证你的邮箱,请稍等...</p>
                {!result && <Spinner color="primary"/>}
            </div>
        </div>
    }
    footer={
        <ResultMessage result={result}/>
    }
    />
  )
}