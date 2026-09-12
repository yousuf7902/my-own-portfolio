"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaGauge,
  FaUser,
  FaCode,
  FaFolder,
  FaTrophy,
  FaTimeline,
  FaRightFromBracket,
  FaBars,
  FaXmark,
} from "react-icons/fa6";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: FaGauge },
  { href: "/admin/about", label: "Hero & About", icon: FaUser },
  { href: "/admin/skills", label: "Skills", icon: FaCode },
  { href: "/admin/projects", label: "Projects", icon: FaFolder },
  { href: "/admin/achievements", label: "Achievements", icon: FaTrophy },
  { href: "/admin/experiences", label: "Timeline", icon: FaTimeline },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    fetch("/api/auth/check")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Render login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-bg_primary flex items-center justify-center">
        <div className="text-primary text-xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg_primary flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex admin-sidebar w-64 flex-col p-4 sticky top-0 h-screen">
        <div className="text-center py-4 mb-6">
          <h2 className="text-2xl font-bold uppercase">
            <span className="text-white">Admin</span>{" "}
            <span className="text-primary text-shadow">Panel</span>
          </h2>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link flex items-center gap-3 ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <a
            href="/"
            className="admin-nav-link flex items-center gap-3 text-gray-500 hover:text-white mb-2"
          >
            ← View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-link flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
          >
            <FaRightFromBracket />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold uppercase">
          <span className="text-white">Admin</span>{" "}
          <span className="text-primary">Panel</span>
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl"
        >
          {sidebarOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="admin-sidebar w-64 h-full flex flex-col p-4 pt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-link flex items-center gap-3 ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-800">
              <a
                href="/"
                className="admin-nav-link flex items-center gap-3 text-gray-500 hover:text-white mb-2"
              >
                ← View Portfolio
              </a>
              <button
                onClick={handleLogout}
                className="admin-nav-link flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
              >
                <FaRightFromBracket />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
