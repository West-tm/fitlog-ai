import Link from "next/link";

import { getChats } from "@/app/actions/chats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTokyoDateLabel } from "@/lib/date";

export default async function ChatsPage() {
  const chats = await getChats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">チャット一覧</h1>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">更新日</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">作成日</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {chats.map((chat) => (
            <TableRow key={chat.id}>
              <TableCell className="whitespace-normal">
                <Link
                  href={`/chats/${chat.id}`}
                  className="line-clamp-3 wrap-anywhere hover:underline"
                >
                  {chat.title}
                </Link>
              </TableCell>

              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatTokyoDateLabel(chat.updatedAt)}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatTokyoDateLabel(chat.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
