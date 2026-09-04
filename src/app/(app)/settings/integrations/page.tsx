import { Plug } from "lucide-react";

import GoogleHealthDataSyncForm from "@/components/health/google-health-data-sync-form";
import { GoogleHealthNoticeToast } from "@/components/health/google-health-notice-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/auth/get-user";
import { syncGoogleHealthDataLogs } from "@/lib/google-health/actions";
import { prisma } from "@/lib/prisma/prisma";

export const metadata = {
  title: "外部サービス連携",
};

type Props = {
  searchParams: Promise<{
    flash?: string | string[];
  }>;
};

function getFirstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SettingsIntegrationsPage({
  searchParams,
}: Props) {
  const user = await getUser();

  const { flash } = await searchParams;

  const googleHealthConnection = await prisma.googleHealthConnection.findUnique(
    { where: { userId: user.id } },
  );

  const isConnected = !!googleHealthConnection;

  return (
    <div className="space-y-6">
      <GoogleHealthNoticeToast flash={getFirstParam(flash)} />

      <div className="space-y-2">
        <h1 className="text-xl font-semibold">外部サービス連携</h1>
        <p>外部サービスとの連携を管理します。</p>
      </div>

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

              <Separator />

              <p className="font-semibold">Google Health API 健康データ同期</p>

              <GoogleHealthDataSyncForm
                onSubmitAction={syncGoogleHealthDataLogs}
              />
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
