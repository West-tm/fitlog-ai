"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signinAction } from "@/app/auth/signin/actions";
import { SigninActionState } from "@/app/auth/signin/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
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

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, formAction, isPending] = useActionState<
    SigninActionState,
    FormData
  >(signinAction, {
    success: false,
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>アカウントにログイン</CardTitle>
          <CardDescription>以下の情報を入力してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">パスワード</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    パスワードをお忘れですか？
                  </Link>
                </div>
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
                <Button type="submit" disabled={isPending}>
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
