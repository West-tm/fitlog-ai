"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useRef } from "react";
import { toast } from "sonner";

import { signinAction } from "@/app/(auth)/auth/signin/actions";
import { SigninActionState } from "@/app/(auth)/auth/signin/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Spinner } from "../ui/spinner";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo@exa";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [formState, formAction, isPending] = useActionState<
    SigninActionState,
    FormData
  >(
    async (prevState, formData) => {
      const result = await signinAction(prevState, formData);
      if (result.success) {
        toast.success("ログインに成功しました。");
        router.push("/chats/new");
      }
      return result;
    },
    { success: false },
  );

  const handleDemoAccount = () => {
    const form = formRef.current;
    if (!form) return;

    const email = form.elements.namedItem("email");
    const password = form.elements.namedItem("password");
    if (!(email instanceof HTMLInputElement)) return;
    if (!(password instanceof HTMLInputElement)) return;
    email.value = DEMO_EMAIL;
    password.value = DEMO_PASSWORD;
    form.requestSubmit();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <p className="text-right text-sm text-muted-foreground">
        ※デモアカウントは共有です。 <br />
        個人情報は入力しないでください。
      </p>

      <Card>
        <CardHeader>
          <CardTitle>アカウントにログイン</CardTitle>
          <CardDescription>以下の情報を入力してください。</CardDescription>
          <CardAction>
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleDemoAccount}
            >
              デモでログイン
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction}>
            <FieldGroup>
              <Field data-disabled={isPending}>
                <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  defaultValue={formState.values?.email}
                  disabled={isPending}
                  aria-invalid={!!formState.errors?.email?.length}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {formState.errors?.email && (
                  <FieldError>{formState.errors.email[0]}</FieldError>
                )}
              </Field>
              <Field data-disabled={isPending}>
                <FieldLabel htmlFor="password">パスワード</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  disabled={isPending}
                  aria-invalid={!!formState.errors?.password?.length}
                  type="password"
                  required
                />
                {formState.errors?.password && (
                  <FieldError>{formState.errors.password[0]}</FieldError>
                )}
              </Field>
              <Field>
                {formState.formError && (
                  <FieldError>{formState.formError}</FieldError>
                )}
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending && <Spinner />}
                  ログインする
                </Button>
                <FieldDescription className="text-center">
                  アカウントをお持ちではありませんか？{" "}
                  <Link href="/auth/signup">サインアップ</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
