"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/get-user";
import { toUtcDateFromIsoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma/prisma";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile";

export async function getProfile() {
  const user = await getUser();

  const userProfile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return userProfile;
}

export async function updateProfile(values: ProfileFormValues) {
  const user = await getUser();

  const result = profileFormSchema.safeParse(values);

  if (!result.success) {
    return {
      result: { success: false, error: "入力内容を確認してください。" },
    };
  }

  const { name, gender, heightCm, birthDate } = result.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      gender: gender ?? null,
      heightCm,
      birthDate: toUtcDateFromIsoDate(birthDate),
    },
  });

  revalidatePath("/", "layout");

  return {
    result: { success: true },
  };
}
