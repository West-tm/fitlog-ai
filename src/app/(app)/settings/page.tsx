import { getProfile } from "@/app/actions/profile";
import ProfileForm from "@/components/profile/profile-form";
import { getUser } from "@/lib/auth/get-user";
import { toTokyoDateString } from "@/lib/date";

export const metadata = {
  title: "設定",
};

export default async function SettingsPage() {
  const user = await getUser();

  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">設定</h1>
        <p>アカウント情報を設定できます。</p>
      </div>
      <ProfileForm
        email={user.email ?? ""}
        defaultValues={{
          name: profile?.name ?? "",
          gender: profile?.gender ?? undefined,
          heightCm: profile?.heightCm?.toString() ?? "",
          birthDate: profile?.birthDate
            ? toTokyoDateString(profile.birthDate)
            : "",
        }}
      />
    </div>
  );
}
