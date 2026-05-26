"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL_STATE);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/50 mb-2">
          Admin Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/50 mb-2">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="button-primary w-full">
        {pending ? "Signing in..." : "Enter Admin"}
      </button>
    </form>
  );
}
