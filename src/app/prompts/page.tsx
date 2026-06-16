import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export default async function PromptsPage() {
  const user = await getUser();

  const prompts = await prisma.prompt.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">指示文の一覧</h1>
        <Button asChild>
          <Link href="/prompts/new">+ 新規作成</Link>
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">タイトル</TableHead>
            <TableHead className="hidden sm:table-cell">指示文</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">
              作成日時
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell>
                <Link
                  href={`/prompts/${prompt.id}`}
                  className="block hover:underline"
                >
                  {prompt.title}
                </Link>
              </TableCell>

              <TableCell className="hidden wrap-anywhere whitespace-normal sm:table-cell">
                {prompt.content}
              </TableCell>

              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {prompt.createdAt.toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
