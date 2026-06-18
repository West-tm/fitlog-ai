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

export default async function FeedbacksPage() {
  const user = await getUser();

  const feedbacks = await prisma.feedback.findMany({
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
        <h1 className="text-xl font-semibold">フィードバックの一覧</h1>
        <Button asChild>
          <Link href="/feedbacks/new">+ 新規作成</Link>
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>フィードバック</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">
              作成日時
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell className="wrap-anywhere whitespace-normal">
                <Link
                  href={`/feedbacks/${feedback.id}`}
                  className="block hover:underline"
                >
                  {feedback.content}
                </Link>
              </TableCell>

              <TableCell className="hidden w-44 text-muted-foreground sm:table-cell">
                {feedback.createdAt.toLocaleString("ja-JP", {
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
