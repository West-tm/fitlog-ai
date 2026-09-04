"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const FLASH_MESSAGES: Record<
  string,
  { type: "success" | "error"; text: string }
> = {
  "google-health-connected": {
    type: "success",
    text: "Google Health と連携しました。",
  },
  "google-health-disconnected": {
    type: "success",
    text: "Google Health 連携を解除しました。",
  },
  "google-health-cancelled": {
    type: "error",
    text: "Google Health 連携がキャンセルされました。",
  },
  "google-health-not-connected": {
    type: "error",
    text: "Google Health 連携はすでに解除されています。",
  },
  "google-health-disconnect-failed": {
    type: "error",
    text: "Google Health 連携の解除に失敗しました。時間をおいて再度お試しください。",
  },
  "google-health-callback-invalid": {
    type: "error",
    text: "Google Health 連携の認証に失敗しました。時間をおいて再度お試しください。",
  },
};

type Props = {
  flash?: string;
};

export function GoogleHealthNoticeToast({ flash }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!flash) return;

    const mapped = FLASH_MESSAGES[flash];

    if (!mapped) return;

    // ページロード直後は Toaster 準備前なので遅延が必須（Sonner 公式）
    const timer = window.setTimeout(() => {
      if (mapped.type === "success") {
        toast.success(mapped.text);
      } else {
        toast.error(mapped.text);
      }

      router.replace("/settings/integrations");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [flash, router]);

  return null;
}
