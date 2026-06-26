import { Plug } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

function getFirstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getIntegrationMessage({
  error,
  notice,
}: {
  error?: string;
  notice?: string;
}) {
  if (notice === "google-health-connected") {
    return {
      type: "success",
      text: "Google Health と連携しました。",
    };
  }

  if (notice === "google-health-disconnected") {
    return {
      type: "success",
      text: "Google Health 連携を解除しました。",
    };
  }

  if (notice === "google-health-not-connected") {
    return {
      type: "error",
      text: "Google Health はまだ連携されていません。",
    };
  }

  if (notice === "google-health-disconnect-failed") {
    return {
      type: "error",
      text: "Google Health 連携の解除に失敗しました。時間をおいて再度お試しください。",
    };
  }

  if (error === "google-health-cancelled") {
    return {
      type: "error",
      text: "Google Health 連携がキャンセルされました。",
    };
  }

  if (error === "authorization-code-missing") {
    return {
      type: "error",
      text: "Google Health の認証コードを取得できませんでした。",
    };
  }

  if (error === "invalid-oauth-state") {
    return {
      type: "error",
      text: "Google Health の OAuth の state パラメータが無効でした。",
    };
  }

  if (error === "token-exchange-failed") {
    return {
      type: "error",
      text: "Google Health の認証トークンを取得できませんでした。",
    };
  }

  if (error === "refresh-token-missing") {
    return {
      type: "error",
      text: "Google Health の継続利用に必要な認証情報を取得できませんでした。",
    };
  }

  if (error === "google-health-upsert-failed") {
    return {
      type: "error",
      text: "Google Health の新規作成・更新に失敗しました。時間をおいて再度お試しください。",
    };
  }

  if (error) {
    return {
      type: "error",
      text: "Google Health 連携に失敗しました。時間をおいて再度お試しください。",
    };
  }

  return null;
}

export default async function SettingsIntegrationsPage({
  searchParams,
}: Props) {
  const user = await getUser();

  const { error, notice } = await searchParams;

  const message = getIntegrationMessage({
    error: getFirstParam(error),
    notice: getFirstParam(notice),
  });

  const googleHealthConnection = await prisma.googleHealthConnection.findFirst({
    where: {
      userId: user.id,
    },
  });

  const isConnected = !!googleHealthConnection;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">外部サービス連携</h1>
        <p>外部サービスとの連携を管理します。</p>
      </div>

      {message && (
        <div
          className={
            message.type === "success" ? "text-green-700" : "text-destructive"
          }
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Google Health</CardTitle>
          <CardDescription>
            歩数・睡眠・健康指標などのデータ取得に使用します。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isConnected ? (
            <>
              <p className="font-medium text-green-600">連携済み</p>
              <form action="/api/google-health/revoke" method="post">
                <Button
                  type="submit"
                  variant="destructive"
                  className="hover:cursor-pointer"
                >
                  Google Health 連携を解除する
                </Button>
              </form>
            </>
          ) : (
            <>
              <p className="font-medium text-muted-foreground">未連携</p>
              <Button asChild>
                <a href="/api/google-health/auth">
                  <Plug />
                  Google Health と連携する
                </a>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
