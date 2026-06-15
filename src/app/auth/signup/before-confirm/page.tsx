import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "メール確認 | FitLog AI",
};

export default function BeforeConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>メールを送信しました</CardTitle>
          <CardDescription>
            メール内のリンクをクリックして登録を完了してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            メールが届かない場合は迷惑メールフォルダをご確認ください。
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/signup">メールアドレスを変更して再登録</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
