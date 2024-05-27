import { fetchCurrentUserLikeIds, fetchLikeMembers } from "../actions/likeActions"
import ListsTab from "./ListsTab"

export default async function Lists({searchParams}:{searchParams:{type:string}}) {
  const likeIds = await fetchCurrentUserLikeIds()
  const members = await fetchLikeMembers(searchParams.type)
  return (
    <div>
        <ListsTab members={members} likeIds={likeIds}/>
    </div>
  )
}