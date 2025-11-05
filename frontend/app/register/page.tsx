"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { authAPI, referralAPI } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialCode = useMemo(() => params.get("r") ?? "", [params]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(initialCode);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = initialCode;
    if (code) {
      referralAPI
        .validateCode(code)
        .then((res) => {
          if (res.data?.valid) setReferrerName(res.data.referrer?.name || null);
        })
        .catch(() => setReferrerName(null));
    }
  }, [initialCode]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authAPI.register({ name, email, password, referralCode: referralCode || undefined });
      router.push("/login");
    } catch (err: unknown) {
      const message = (err as AxiosError<{ message?: string }>)?.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {referrerName && (
        <div className="mb-4 rounded border bg-green-50 p-3 text-sm text-green-800">
          You're joining via {referrerName}'s referral. They'll earn 8 coins and you'll get 4 coins when you sign up.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Referral Code (optional)</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
}
