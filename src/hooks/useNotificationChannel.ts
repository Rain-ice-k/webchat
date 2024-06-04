import { pusherClient } from "@/lib/pusher"
import { MessageDto } from "@/types"
import { usePathname, useSearchParams } from "next/navigation"
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./useMessageStore"
import { newMessageToast } from "@/components/NewMessageToast"
import { newLikeToast } from "@/components/NotiicationToast"

export const useNotificationChannel = (userId: string | null) => {
    const channelRef = useRef<Channel | null>(null)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const {add,updateUnreadCount} = useMessageStore(state=>({
        add: state.add,
        updateUnreadCount: state.updateUnreadCount
    }))
    const handleNewMessage = useCallback((message: MessageDto)=>{
        if (pathname ==='/messages'&& searchParams.get('container')!=='outbox'){
            add(message)
            updateUnreadCount(1)
        }else if(pathname !== `/members/${message.senderId}/chat`){
            newMessageToast(message)
            updateUnreadCount(1)
        }
    }, [add, pathname,searchParams, updateUnreadCount])
    const handleNewLike = useCallback((data: {name:string, image: string | null, userId: string}) => {
        newLikeToast(data.name, data.image, data.userId);
    }, [])
    useEffect(()=>{
        if(!userId) return
        if(!channelRef.current){
            channelRef.current = pusherClient.subscribe(`private-${userId}`)
            channelRef.current.bind('message:new',handleNewMessage)
            channelRef.current.bind('like:new', handleNewLike);
        }
        return () =>{
            if(channelRef.current && channelRef.current.subscribed){
                channelRef.current.unsubscribe()
                channelRef.current.unbind('message:new',handleNewMessage)
                channelRef.current.unbind('like:new', handleNewLike);
                channelRef.current = null
            }
        }
    }, [userId,handleNewMessage,handleNewLike])
}