import { SigninForm } from "@/components/auth/signin-form";

export default function SigninPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  );
}
