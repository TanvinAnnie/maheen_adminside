"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

      <div className="mb-8 text-center">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
          M
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          Admin Login
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back! Please login.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <label className="mb-2 block font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-black"
            required
          />

        </div>

        <div>

          <label className="mb-2 block font-semibold text-gray-700">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-16 text-gray-900 outline-none transition focus:border-black"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        {error && (
          <div className="rounded-xl bg-red-100 p-3 text-center text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}