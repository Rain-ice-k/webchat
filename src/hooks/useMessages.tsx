import { deleteMessage } from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback, Key, useEffect } from "react";
import useMessageStore from "./useMessageStore";

export default function useMessages(initialMessages: MessageDto[]) {
    const {set, remove,messages, updateUnreadCount} = useMessageStore(state=>({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount
    }))
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOutbox = searchParams.get("container") === "outbox";
    const [isDeleting, setDeleting] = useState({ id: "", loading: false });
    
    useEffect(()=>{
        set(initialMessages)
        return ()=>{
            set([])
        }
    },[initialMessages,set])

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
    }
}