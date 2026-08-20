"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

type Props = {
  email: string;
  defaultValues?: {
    name: string;
    gender?: ProfileFormValues["gender"];
    heightCm: string;
    birthDate: string;
  };
};

export default function ProfileForm({ email, defaultValues }: Props) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  // refガードをレンダー中に評価しないよう、handleSubmitはsubmit時に実行する
  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    try {
      const { result } = await updateProfile(values);
      if (!result.success) {
        setError("root", { message: result.error });
        return;
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>アカウント情報</CardTitle>
          <CardDescription>
            メールアドレスは変更不可。性別以外は更新時に入力必須です。設定するとより精度の高いアドバイスを受けられます。
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Label className="w-32 shrink-0">メールアドレス</Label>
            <Input value={email} disabled />
          </div>

          <div className="flex items-center">
            <Label htmlFor="name" className="w-32 shrink-0">
              名前<span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} disabled={isPending} />
          </div>
          {errors.name && (
            <p className="text-destructive">{errors.name.message}</p>
          )}

          <div className="flex items-center">
            <Label htmlFor="gender" className="w-32 shrink-0">
              性別
            </Label>

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="性別を選択" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="w-(--radix-select-trigger-width)"
                  >
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {errors.gender && (
            <p className="text-destructive">{errors.gender.message}</p>
          )}

          <div className="flex items-center">
            <Label htmlFor="heightCm" className="w-32 shrink-0">
              身長<span className="text-destructive">*</span>
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={100}
              max={250}
              step={1}
              {...register("heightCm")}
              disabled={isPending}
            />
          </div>
          {errors.heightCm && (
            <p className="text-destructive">{errors.heightCm.message}</p>
          )}

          <div className="flex items-center">
            <Label htmlFor="birthDate" className="w-32 shrink-0">
              生年月日<span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              id="birthDate"
              {...register("birthDate")}
              disabled={isPending}
            />
          </div>
          {errors.birthDate && (
            <p className="text-destructive">{errors.birthDate.message}</p>
          )}
        </CardContent>

        <CardFooter className="flex-col items-start gap-4">
          <Button className="cursor-pointer" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : <Save />}
            {isPending ? "保存中" : "保存"}
          </Button>
          {errors.root && (
            <p className="text-destructive">{errors.root.message}</p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
