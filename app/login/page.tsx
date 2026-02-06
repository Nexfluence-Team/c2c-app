"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../../lib/supabase"
import Select from "../../components/Select"
import { PLATFORMS, NICHES, FOLLOWER_RANGES } from "../../lib/options"

function followerRangeToNumber(range: string) {
  switch (range) {
    case "1k-10k":
      return 5000
    case "10k-50k":
      return 30000
    case "50k-100k":
      return 75000
    case "100k+":
      return 150000
    default:
      return 1000
  }
}
export default function Login() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [mode, setMode] = useState<"login" | "signup">("login")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    platform: "",
    industry: "",
    followers: "",
    profileLink: "",
    requests: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setError("")
  }

  async function submit() {
    setLoading(true)
    setError("")

    if (!form.email || !form.password) {
      setError("Please enter both your email and password.")
      setLoading(false)
      return
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        })

        if (error) {
          setError("Invalid email or password. Please try again.")
          setLoading(false)
          return
        }

        router.push("/")
      } else {
        if (!form.name || !form.platform || !form.industry) {
          setError("Please complete all creator profile fields.")
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password
        })

        if (error || !data.user) {
          setError(error?.message || "Signup failed. Please try again.")
          setLoading(false)
          return
        }

const { error: profileError } = await supabase.from("profiles").insert({
  id: data.user.id,
  name: form.name,
  platform: form.platform,
  industry: form.industry,
  followers: Number(form.followers),
  bio: form.requests || `Creator on ${form.platform}`
})

if (profileError) {
  console.error(profileError)
  setError("Account created, but profile details could not be saved.")
  setLoading(false)
  return
}


        router.push("/")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center
                     bg-gradient-to-br from-[#f4f1ff] via-[#fdf6ff] to-[#fff9f1]
                     relative overflow-hidden px-4">

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Image
          src="/logofina.png"
          alt="Nexfluence Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-xl
                      bg-white/60 backdrop-blur-xl
                      border border-white/40
                      rounded-2xl shadow-2xl
                      p-6 sm:p-8 md:p-10">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2
                       bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
                       bg-clip-text text-transparent">
          Welcome to Cheesecake
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Where creators don’t just collaborate — they build influence ecosystems.
        </p>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-white/50 rounded-full p-1">
          <button
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition
              ${mode === "login"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-gray-600 hover:bg-white/60"}
            `}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition
              ${mode === "signup"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-gray-600 hover:bg-white/60"}
            `}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                           outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Full Name"
                onChange={e => update("name", e.target.value)}
              />

              <Select
                value={form.platform}
                onChange={v => update("platform", v)}
                options={PLATFORMS}
                placeholder="Select primary platform"
              />

              <Select
                value={form.industry}
                onChange={v => update("industry", v)}
                options={NICHES}
                placeholder="Select industry / niche"
              />

              <select
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                           outline-none focus:ring-2 focus:ring-purple-400"
                onChange={e => update("followers", e.target.value)}
              >
                <option value="">Select follower range</option>
                {FOLLOWER_RANGES.map(r => (
                  <option key={r.label} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <input
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                           outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Profile link (optional)"
                onChange={e => update("profileLink", e.target.value)}
              />

              <textarea
                rows={3}
                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                           outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                placeholder="Special requests or collaboration goals"
                onChange={e => update("requests", e.target.value)}
              />
            </>
          )}

          <input
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                       outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Email address"
            onChange={e => update("email", e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-200
                       outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Password"
            onChange={e => update("password", e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={loading}
          onClick={submit}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-purple-600 to-pink-500
                     hover:opacity-90 transition
                     disabled:opacity-60"
        >
          {loading
            ? "Authenticating…"
            : mode === "login"
            ? "Enter Nexfluence Network"
            : "Create Creator Profile"}
        </button>

        {/* Footer Text */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Designed for creators, brands, and agencies shaping the future of influence
        </p>
      </div>
    </main>
  )
}
