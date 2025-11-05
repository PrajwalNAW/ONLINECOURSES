"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { purchaseAPI, referralAPI } from "../../lib/api";

type Purchase = {
  _id: string;
  course: { _id: string; title: string; price?: number };
  amount: number;
  creditsEarned: number;
  purchaseDate: string;
};

type ReferredUser = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'converted';
  hasPurchased: boolean;
  joinedAt: string;
  convertedAt?: string;
  coinsEarnedFromPurchase: number; // 10 if converted, else 0
};

export default function ProfilePage() {
  const { user, initFromStorage } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [referred, setReferred] = useState<ReferredUser[]>([]);
  const [totalReferred, setTotalReferred] = useState(0);

  useEffect(() => {
    initFromStorage();
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [initFromStorage]);

  useEffect(() => {
    if (!user) return;
    purchaseAPI
      .getMyPurchases()
      .then((res) => setPurchases(res.data?.purchases || []))
      .catch(() => setPurchases([]));

    referralAPI
      .getDashboard()
      .then((res) => {
        setReferred(res.data?.referredUsers || []);
        setTotalReferred(res.data?.metrics?.totalReferred || 0);
      })
      .catch(() => {
        setReferred([]);
        setTotalReferred(0);
      });
  }, [user]);

  const referralLink = useMemo(() => {
    if (!user) return "";
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    return `${origin}/register?r=${user.referralCode}`;
  }, [user]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>You must be logged in to view your profile.</p>;

  return (
    <section className="space-y-8">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-50 via-white to-white">
        <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative flex items-center gap-5 p-6 sm:p-8">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-extrabold text-white shadow">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 shadow">
            Coins: <span className="font-semibold">{user.credits ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Referral */}
        <div className="rounded-2xl border p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Your Referral</h2>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Code: {user.referralCode}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input readOnly value={referralLink} className="w-full rounded border px-3 py-2" />
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-600">Share this link. You get 8 coins and your friend gets 4 on signup, then you get 10 more on their first purchase.</p>
        </div>

        {/* Purchases */}
        <div className="rounded-2xl border p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Purchases</h2>
            <span className="text-xs text-gray-500">{purchases.length} total</span>
          </div>
          {purchases.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600">No purchases yet. Browse courses to get started.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {purchases.map((p) => (
                <li key={p._id} className="group rounded-xl border p-4 transition hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium leading-tight">{p.course?.title}</p>
                      <p className="text-xs text-gray-600">{new Date(p.purchaseDate).toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{p.amount} coins</span>
                  </div>
                  <div className="mt-2 text-xs text-green-700">+{p.creditsEarned} coins</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Referred friends list */}
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">People Referred by You</h2>
          <span className="text-xs text-gray-500">{totalReferred} total</span>
        </div>
        {referred.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No referrals yet. Share your link to earn coins.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {referred.map((r) => (
              <li key={r.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.name || r.email}</p>
                    <p className="text-xs text-gray-600">Joined: {new Date(r.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${r.status === 'converted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  Coins earned from their purchase: <span className="font-semibold">{r.coinsEarnedFromPurchase}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
