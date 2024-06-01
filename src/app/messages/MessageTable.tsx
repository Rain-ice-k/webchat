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
import MessageTableCell from "./MessageTableCell";
import useMessages from "@/hooks/useMessages";
type Props = {
  initialMessages: MessageDto[];
};
export default function MessageTable({ initialMessages }: Props) {
  const {isDeleting, isOutbox,columns,deleteMessage,selectRow,messages} = useMessages(initialMessages)
  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="信息栏"
        selectionMode="single"
        onRowAction={(key) => selectRow(key)}
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
                  <MessageTableCell
                    item={item}
                    columnKey={columnKey as string}
                    isOutbox={isOutbox}
                    deleteMessage={deleteMessage}
                    isDeleting={isDeleting.loading &&isDeleting.id ===item.id}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
