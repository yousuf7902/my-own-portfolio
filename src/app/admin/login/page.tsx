"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg_primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase">
            <span className="text-white">Admin</span>{" "}
            <span className="text-primary text-shadow">Panel</span>
          </h1>
          <p className="text-gray-400 mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-8">
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn w-full text-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          <a href="/" className="hover:text-primary transition-colors">
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
