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
} from "@nextui-org/react";
import MessageTableCell from "./MessageTableCell";
import useMessages from "@/hooks/useMessages";
type Props = {
  initialMessages: MessageDto[];
  nextCursor?: string;
};
export default function MessageTable({ initialMessages, nextCursor }: Props) {
  const {
    isDeleting,
    isOutbox,
    columns,
    deleteMessage,
    selectRow,
    messages,
    loadMore,
    loadingMore,
    hasMore,
  } = useMessages(initialMessages);
  return (
    <div className="flex flex-col h-[80vh]">
      <Card>
        <Table
          aria-label="信息栏"
          selectionMode="single"
          onRowAction={(key) => selectRow(key)}
          shadow="none"
          className="flex flex-col gap-3 h-[80vh] overflow-auto"
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
                      isDeleting={
                        isDeleting.loading && isDeleting.id === item.id
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="sticky bottom-0 pb-3 mr-3 text-right">
          <Button
            color="primary"
            isLoading={loadingMore}
            isDisabled={!hasMore}
            onClick={loadMore}
          >
            {hasMore ? '加载更多': '无更多消息'}            
          </Button>
        </div>
      </Card>
    </div>
  );
}
