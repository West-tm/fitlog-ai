import { Plus } from "lucide-react";
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

import { getFeedbacks } from "../actions/feedbacks";

export default async function FeedbacksPage() {
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">フィードバックの一覧</h1>
        <Button asChild>
          <Link href="/feedbacks/new">
            <Plus />
            新規作成
          </Link>
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>フィードバック</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">更新日</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">作成日</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell className="whitespace-normal">
                <Link
                  href={`/feedbacks/${feedback.id}`}
                  className="line-clamp-3 wrap-anywhere hover:underline"
                >
                  {feedback.content}
                </Link>
              </TableCell>

              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {feedback.updatedAt.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {feedback.createdAt.toLocaleDateString("ja-JP", {
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
