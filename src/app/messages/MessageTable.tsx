"use client";

import { MessageDto } from "@/types";
import {
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
import { Key } from "react";
type Props = {
  messages: MessageDto[];
};
export default function MessageTable({ messages }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get("container") === "outbox";
  const columns = [
    {
      key: isOutbox ? "recipientName" : "senderName",
      label: isOutbox ? "接收者" : "发件者",
    },
    { key: "text", label: "内容" },
    { key: "created", label: isOutbox ? "已发送的信息" : "已收到的信息" },
  ];

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + "/chat");
  };

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
            <TableColumn key={column.key}>{column.label}</TableColumn>
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
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
