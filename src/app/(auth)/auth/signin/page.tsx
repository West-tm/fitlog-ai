import { SigninForm } from "@/components/auth/signin-form";
import { Separator } from "@/components/ui/separator";

export default function SigninPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold">
          連携データ活用型 AI 相談アプリ
        </h1>
        <p className="text-sm text-muted-foreground">
          次の3つを使って、AI が相談に答えます。
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          <li>スマートウォッチや体組成計由来の Google Health データ</li>
          <li>指示文（例：今週の運動/食事を採点してください）</li>
          <li>チャットに入力したテキスト（例：外食が多かった）</li>
        </ul>

        <Separator />

        <SigninForm />
      </div>
    </div>
  );
}
