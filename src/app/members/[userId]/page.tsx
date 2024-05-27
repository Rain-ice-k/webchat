import { getMemberByUserId } from "@/app/actions/memberActions"
import CardInnerWrapper from "@/components/CardInnerWrapper"
import { notFound } from "next/navigation"

export default async function MemberDetailedPage({params}:{params:{userId:string}}) {
    const member = await getMemberByUserId(params.userId)
    if(!member) return notFound()
    return (
      <CardInnerWrapper 
      header='简介'
      body={<div>{member.description}</div>}
  />
      )
}