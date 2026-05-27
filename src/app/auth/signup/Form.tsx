"use client";

import { useActionState } from "react";
import { signupAction, SignupActionState } from "./actions";

const initialState: SignupActionState = {
  message: "",
  errors: {},
};

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );
  return (
    <form action={formAction}>
      {state.message && <p className="text-red-500">{state.message}</p>}
      <div className="flex gap-3">
        <label htmlFor="email">メールアドレス</label>
        <input name="email" type="email" placeholder="email@example.com" />
        {state.errors.email && (
          <p className="text-red-500">{state.errors.email}</p>
        )}
      </div>
      <div className="flex gap-3">
        <label htmlFor="password">パスワード</label>
        <input name="password" type="password" placeholder="Password1234" />
        {state.errors.password && (
          <p className="text-red-500">{state.errors.password}</p>
        )}
      </div>
      <button className="mt-3 bg-sky-500" disabled={isPending}>
        {isPending ? "登録中・・・" : "サインアップ"}
      </button>
    </form>
  );
}
