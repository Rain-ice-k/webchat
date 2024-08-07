import { deleteMessage, getMessagesByContainer } from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback, Key, useEffect, useRef } from "react";
import useMessageStore from "./useMessageStore";

export default function useMessages(initialMessages: MessageDto[], nextCursor?: string) {
  const cursorRef = useRef(nextCursor)  
  const {set, remove, messages, updateUnreadCount, resetMessages} = useMessageStore(state=>({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages
    }))
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOutbox = searchParams.get("container") === "outbox";
    const container = searchParams.get('container')
    const [isDeleting, setDeleting] = useState({ id: "", loading: false });
    const [loadingMore, setLodingMore] = useState(false)

    useEffect(()=>{
        set(initialMessages)
        cursorRef.current = nextCursor
        return ()=>{
            resetMessages()
        }
    },[initialMessages,resetMessages,set, nextCursor])

    const loadMore = useCallback(async () => {
      if(cursorRef.current){
            setLodingMore(true)
            const {messages, nextCursor} = await getMessagesByContainer(container, cursorRef.current)
            set(messages)
            cursorRef.current = nextCursor
            setLodingMore(false)
          } 
    }, [container, set])

    const handleDeleteMessage = useCallback(
      async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);
        remove(message.id)
        if(!message.dateRead && !isOutbox)updateUnreadCount(-1)
        setDeleting({ id: "", loading: true });
      },
      [isOutbox, remove, updateUnreadCount]
    );
    const columns = [
      {
        key: isOutbox ? "recipientName" : "senderName",
        label: isOutbox ? "接收者" : "发件者",
      },
      { key: "text", label: "内容" },
      { key: "created", label: isOutbox ? "已发送的信息" : "已收到的信息" },
      { key: "actions", label: "行为" },
    ];
  
    const handleRowSelect = (key: Key) => {
      const message = messages.find((m) => m.id === key);
      const url = isOutbox
        ? `/members/${message?.recipientId}`
        : `/members/${message?.senderId}`;
      router.push(url + "/chat");
    };
    return {
        isOutbox,
        columns,
        deleteMessage: handleDeleteMessage,
        selectRow: handleRowSelect,
        isDeleting,
        messages,
        loadMore,
        loadingMore,
        hasMore: !!cursorRef.current
    }
}