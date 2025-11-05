"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";

const navLink =
  "relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition group";

export default function Header() {
  const router = useRouter();
  const { user, token, initFromStorage, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[var(--header-height)] items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white grid place-items-center text-sm font-extrabold shadow">
              OC
            </div>
            <span className="hidden sm:inline text-lg font-semibold tracking-tight">OnlineCourses</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-gray-700">
            <Link href="/" className={navLink}>
              Home
              <span className="pointer-events-none absolute left-3 -bottom-0.5 h-0.5 w-[calc(100%-1.5rem)] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link href="/about" className={navLink}>
              About Us
              <span className="pointer-events-none absolute left-3 -bottom-0.5 h-0.5 w-[calc(100%-1.5rem)] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link href="/contact" className={navLink}>
              Contact Us
              <span className="pointer-events-none absolute left-3 -bottom-0.5 h-0.5 w-[calc(100%-1.5rem)] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link href="/courses" className={navLink}>
              Available Courses
              <span className="pointer-events-none absolute left-3 -bottom-0.5 h-0.5 w-[calc(100%-1.5rem)] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </nav>

          {/* Auth + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-50"
              aria-label="Toggle Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-0">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>

            {token && user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:opacity-90"
                  title="Profile"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-200 grid place-items-center text-sm font-semibold text-gray-700">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:inline text-sm">{user.name}</span>
                </Link>
<button
                  onClick={() => { logout(); router.push('/'); }}
                  className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <div className="flex flex-col text-gray-700">
              <Link href="/" className="py-2" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/about" className="py-2" onClick={() => setOpen(false)}>About Us</Link>
              <Link href="/contact" className="py-2" onClick={() => setOpen(false)}>Contact Us</Link>
              <Link href="/courses" className="py-2" onClick={() => setOpen(false)}>Available Courses</Link>
            </div>
            {token && user ? (
              <div className="flex items-center justify-between">
                <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </Link>
<button onClick={() => { logout(); setOpen(false); router.push('/'); }} className="rounded-md border px-3 py-2 text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-md border px-3 py-2 text-sm">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm text-white shadow">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
