"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  googleHealthWeightSyncFormSchema,
  GoogleHealthWeightSyncFormValues,
} from "@/lib/google-health/validations";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

type Props = {
  onSubmitAction: (
    values: GoogleHealthWeightSyncFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
  defaultValues?: GoogleHealthWeightSyncFormValues;
};

const date = new Date();

const today = date.toLocaleDateString("sv-SE", {
  timeZone: "Asia/Tokyo",
});

date.setDate(date.getDate() - 89);
const ninetyDaysAgo = date.toLocaleDateString("sv-SE", {
  timeZone: "Asia/Tokyo",
});

export default function GoogleHealthWeightSyncForm({
  onSubmitAction,
  defaultValues = { startDate: ninetyDaysAgo, endDate: today },
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GoogleHealthWeightSyncFormValues>({
    resolver: zodResolver(googleHealthWeightSyncFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  // refガードをレンダー中に評価しないよう、handleSubmitはsubmit時に実行する
  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (values: GoogleHealthWeightSyncFormValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    try {
      const result = await onSubmitAction(values);

      if (!result.success) {
        setError("root", { message: result.error });
      }
    } catch (error) {
      console.log(error);
      setError("root", {
        message:
          "Google Health API のデータ取得に失敗しました。時間をおいて再度お試しください。",
      });
    } finally {
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }
  };

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <div className="space-y-2">
          <Label htmlFor="startDate">開始日</Label>
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
            disabled={isPending}
          />
        </div>
        {errors.startDate && (
          <p className="text-destructive">{errors.startDate.message}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="endDate">終了日</Label>
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
            disabled={isPending}
          />
        </div>
        {errors.endDate && (
          <p className="text-destructive">{errors.endDate.message}</p>
        )}
        <Button className="cursor-pointer" type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : <Save />}
          {isPending ? "データ取得中" : "データ取得"}
        </Button>
        {errors.root && (
          <p className="text-destructive">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}
