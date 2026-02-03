"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../../lib/supabase"

export default function Login() {
  // --- ALL HOOKS FIRST ---
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [mode, setMode] = useState<"login" | "signup">("login")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    platform: "",
    industry: "",
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
    setError("") // Clear error while typing
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
          requests: form.requests,
          bio: `Creator on ${form.platform}`
        })

        if (profileError) {
          setError("Profile created, but we couldn’t save your creator details.")
          setLoading(false)
          return
        }

        router.push("/")
      }
    } catch {
      setError("Something went wrong. Please try again in a moment.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0218]">

      {/* Glow Background */}
      <div className="glow top-10 left-10 opacity-30"></div>
      <div className="glow bottom-10 right-10 opacity-30"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <Image
          src="/logofina.png"
          alt="Nexfluence Logo"
          width={140}
          height={50}
          className="object-contain"
        />
      </div>

      {/* Glass Card */}
      <div
        className="glass w-full max-w-xl p-10 relative z-10
                   bg-black/40 backdrop-blur-2xl border border-purple-400/30
                   text-white shadow-2xl"
      >
        {/* Headline */}
        <h1
          className="text-4xl font-extrabold text-center mb-2
                     bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Welcome to Cheesecake Platform
        </h1>

        <p className="text-center text-purple-200 text-sm mb-8 italic">
          Where creators don’t just collaborate — they build influence ecosystems.
        </p>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-purple-900/40 rounded-full p-1">
          <button
            className={`flex-1 py-2 rounded-full transition font-semibold ${
              mode === "login"
                ? "bg-purple-500/40 text-white"
                : "text-purple-300 hover:bg-purple-500/20"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={`flex-1 py-2 rounded-full transition font-semibold ${
              mode === "signup"
                ? "bg-purple-500/40 text-white"
                : "text-purple-300 hover:bg-purple-500/20"
            }`}
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
                className="w-full p-3 rounded-xl
                           bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                           outline-none focus:bg-purple-900/50 transition"
                placeholder="Full Name"
                onChange={e => update("name", e.target.value)}
              />

              <input
                className="w-full p-3 rounded-xl
                           bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                           outline-none focus:bg-purple-900/50 transition"
                placeholder="Primary Platform (YouTube, TikTok, Instagram)"
                onChange={e => update("platform", e.target.value)}
              />

              <input
                className="w-full p-3 rounded-xl
                           bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                           outline-none focus:bg-purple-900/50 transition"
                placeholder="Industry / Niche (Tech, Fashion, Gaming, Fitness)"
                onChange={e => update("industry", e.target.value)}
              />

              <textarea
                rows={3}
                className="w-full p-3 rounded-xl resize-none
                           bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                           outline-none focus:bg-purple-900/50 transition"
                placeholder="Special Requests or Collaboration Goals"
                onChange={e => update("requests", e.target.value)}
              />
            </>
          )}

          <input
            className="w-full p-3 rounded-xl
                       bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                       outline-none focus:bg-purple-900/50 transition"
            placeholder="Email address"
            onChange={e => update("email", e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-xl
                       bg-purple-900/30 text-purple-100 placeholder-purple-300/70
                       outline-none focus:bg-purple-900/50 transition"
            placeholder="Password"
            onChange={e => update("password", e.target.value)}
          />
        </div>

        {/* Error Box */}
        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-sm
                       bg-red-900/40 border border-red-400/40
                       text-red-200 animate-pulse"
          >
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-purple-400 hover:to-pink-400
            transition transform hover:scale-105 shadow-lg
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
          onClick={submit}
        >
          {loading
            ? "Authenticating..."
            : mode === "login"
            ? "Enter Nexfluence Network"
            : "Create Creator Profile"}
        </button>

        {/* Industry Quotes */}
        <div className="mt-8 text-center text-sm text-purple-300 space-y-2">
          <p>“Collaboration is the new currency of digital growth.”</p>
          <p>“Every creator is a media company in the making.”</p>
          <p className="text-purple-400">
            Designed for creators, brands, and agencies shaping the future of influence
          </p>
        </div>
      </div>
    </main>
  )
}
