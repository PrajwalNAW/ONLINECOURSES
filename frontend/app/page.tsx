export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-indigo-50 via-white to-white py-20 sm:py-24">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl">
            Transform Your Learning with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mt-5 text-lg text-gray-600">
            OnlineCourses is your hub for high‑quality courses. Earn coins by referring friends:
            you get 8 coins and your friend gets 4 on signup, then you get 10 more when they purchase.
            You start with 2 coins. Each course costs 10 coins.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/courses" className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow hover:opacity-95">
              Start Learning
            </a>
            <a href="/about" className="rounded-md border px-6 py-3 text-gray-800 hover:bg-gray-50">
              Watch Demo
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 select-none">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 shadow">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Backend Connected
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3 mt-10">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Quality Courses</h3>
          <p className="text-sm text-gray-600">Hand‑picked content across dev, design, data and more.</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Earn Coins</h3>
          <p className="text-sm text-gray-600">+8 to you and +4 to friend on signup, +10 to you on their first purchase.</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Track Referrals</h3>
          <p className="text-sm text-gray-600">Share your code and watch your credits grow.</p>
        </div>
      </section>
    </>
  );
}
