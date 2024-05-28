"use client";

import { MessageDto } from "@/types";
import {
  Avatar,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageActions";
import { truncateString } from "@/lib/util";
type Props = {
  messages: MessageDto[];
};
export default function MessageTable({ messages }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get("container") === "outbox";
  const [isDeleting, setDeleting] = useState({ id: "", loading: false });
  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setDeleting({ id: message.id, loading: true });
      await deleteMessage(message.id, isOutbox);
      router.refresh();
      setDeleting({ id: "", loading: true });
    },
    [isOutbox, router]
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
  const renderCell = useCallback(
    (item: MessageDto, columnKey: keyof MessageDto) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className={`flex items-center gap-2 cursor-pointer`}>
              <Avatar
                alt="成员图像"
                src={
                  (isOutbox ? item.recipientImage : item.senderImage) ||
                  "images/user.png"
                }
              />
            </div>
          );
        case "text":
          return <div>{truncateString(cellValue, 80)}</div>;
        case "created":
          return cellValue;
        default:
          return (
            <Button
              isIconOnly
              variant="light"
              onClick={() => handleDeleteMessage(item)}
              isLoading={isDeleting.id === item.id && isDeleting.loading}
            >
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          );
      }
    },
    [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage]
  );
  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="信息栏"
        selectionMode="single"
        onRowAction={(key) => handleRowSelect(key)}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={column.key === "text" ? "50%" : undefined}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={messages} emptyContent="没有消息">
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutbox ? "font-semibold" : ""
                  }`}
                >
                  <div>{renderCell(item, columnKey as keyof MessageDto)}</div>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
