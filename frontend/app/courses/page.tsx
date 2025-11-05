"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { courseAPI, purchaseAPI } from "../../lib/api";
import { useAuthStore } from "../../store/auth";

type Course = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  category?: string;
};

const categoryIcon = (name?: string) => {
  const n = (name || "").toLowerCase();
  if (n.includes("front")) return "❤";
  if (n.includes("security")) return "🌐";
  if (n.includes("back")) return "🧩";
  if (n.includes("full")) return "🎙";
  if (n.includes("data")) return "📊";
  if (n.includes("design")) return "🎨";
  return "📚";
};

export default function CoursesPage() {
  const router = useRouter();
  const { token, initFromStorage } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    initFromStorage();
    let mounted = true;
    courseAPI
      .getAll()
      .then((res) => {
        if (mounted) setCourses(res.data?.courses || []);
      })
      .catch(() => {
        if (mounted) setCourses([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [initFromStorage]);

  const categoryCards = useMemo(() => {
    // Group by category and pick a representative course
    const map = new Map<string, { count: number; sample: Course }>();
    for (const c of courses) {
      const key = c.category || "General";
      const item = map.get(key);
      if (!item) map.set(key, { count: 1, sample: c });
      else {
        item.count += 1;
        if (!item.sample.thumbnail && c.thumbnail) item.sample = c; // prefer one with image
      }
    }
    return Array.from(map.entries()).map(([category, { count, sample }]) => ({
      category,
      count,
      sample,
    }));
  }, [courses]);

  const buy = async (id: string) => {
    if (!token) {
      setMessage("Please login to purchase.");
      return;
    }
    setMessage(null);
    try {
      const { data } = await purchaseAPI.create(id);
      setMessage(`Purchased: ${data.purchase.course}. Remaining coins: ${data.purchase.remainingCoins}`);
      router.push("/profile");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Purchase failed or already bought.";
      setMessage(msg);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Available Courses</h1>
      {message && <p className="text-sm text-green-700">{message}</p>}
      {loading ? (
        <p className="text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600">No courses available yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Big Intro Card (hidden for logged-in users) */}
          {!token && (
            <div className="relative col-span-1 row-span-2 rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-800 p-7 text-white shadow-xl md:row-span-2">
              <p className="text-sm text-gray-300">HTML, CSS & Javascript</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Web Development Intro</h2>
              <p className="mt-4 max-w-sm text-gray-300">Ready to start your web development journey?</p>
              <button
                onClick={() => router.push("/register")}
                className="mt-8 rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
              >
                ENROLL NOW
              </button>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          )}

          {/* Category cards styled like screenshot */}
          {categoryCards.slice(0, 5).map(({ category, count, sample }) => (
            <article
              key={category}
              className="group relative overflow-hidden rounded-2xl border shadow-lg"
              style={{ backgroundImage: `url(${sample.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="relative p-5 text-white">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-base text-gray-900 shadow">
                    {categoryIcon(category)}
                  </span>
                </div>
                <h3 className="mt-24 text-2xl font-semibold drop-shadow-sm">{category}</h3>
                <p className="text-sm text-white/80">{count} Courses</p>
                {/* Quick buy of representative course */}
                {sample?._id && (
                  <button
                    onClick={() => buy(sample._id)}
                    className="mt-3 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-white"
                  >
                    Buy for 10 coins
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
