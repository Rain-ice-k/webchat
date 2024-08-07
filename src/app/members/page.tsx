import PaginationComponent from "@/components/PaginationComponent";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import { getMembers } from "../actions/memberActions";
import MemberCard from "./MemberCard";
import { GetMemberParams } from "@/types";
import EmptyState from "@/components/EmptyState";
export default async function MembersPage({searchParams}: {searchParams:GetMemberParams}) {
  const {items: members, totalCount} = await getMembers(searchParams)
  const likeIds = await fetchCurrentUserLikeIds()
  return (
    <>
    {!members || members.length === 0?(
      <EmptyState />
    ): (
      <>
       <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
      {members && members.map(member =>(
        <MemberCard member={member} key={member.id} likeIds={likeIds}/>
      ))}
    </div>
    <PaginationComponent totalCount={totalCount}/>
    </>
    )}
    
    </>
   
  )
}