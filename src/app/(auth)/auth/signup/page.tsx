import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "サインアップ",
};

export default function SignupPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
