import { getUnapprovedPhotos } from "@/app/actions/adminAction"
import MemberPhotos from "@/components/MemberPhoto"
import { Divider } from "@nextui-org/react"

export default async function PhotoModerationPage() {
  const photo = await getUnapprovedPhotos()
  return (
    <div className="flex flex-col mt-10 gap-3">
      <h3 className="text-2xl">图片等待审核</h3>
      <Divider />
      <MemberPhotos photos={photo}/>
    </div>
  )
}