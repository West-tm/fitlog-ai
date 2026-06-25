"use client";

import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";

import { signupAction } from "@/app/auth/signup/actions";
import { type SignupActionState } from "@/app/auth/signup/schema";
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

import { Spinner } from "../ui/spinner";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [formState, formAction, isPending] = useActionState<
    SignupActionState,
    FormData
  >(signupAction, {
    success: false,
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>アカウント作成</CardTitle>
        <CardDescription>以下の情報を入力してください。</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
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
              <FieldDescription>8文字以上の長さが必要です。</FieldDescription>
              {formState.errors?.password && (
                <FieldError>{formState.errors.password[0]}</FieldError>
              )}
            </Field>
            <Field data-disabled={isPending}>
              <FieldLabel htmlFor="confirm-password">パスワード確認</FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                disabled={isPending}
                aria-invalid={!!formState.errors?.confirmPassword?.length}
                type="password"
                required
              />
              <FieldDescription>
                確認の為、再度パスワードを入力してください。
              </FieldDescription>
              {formState.errors?.confirmPassword && (
                <FieldError>{formState.errors.confirmPassword[0]}</FieldError>
              )}
            </Field>
            <FieldGroup>
              <Field>
                {formState.formError && (
                  <FieldError className="whitespace-pre-line">
                    {formState.formError}
                  </FieldError>
                )}
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner />}
                  アカウントを作成する
                </Button>
                <FieldDescription className="px-6 text-center">
                  既にアカウントをお持ちですか？{" "}
                  <Link href="/auth/signin">ログイン</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}
