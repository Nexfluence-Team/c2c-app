"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { runCheesecake } from "../../lib/cheesecake"
import { loadSession, clearSession } from "../../lib/session"
import { supabase } from "../../lib/supabase"

type SessionData = {
  a: number
  b: number
  engagement?: number
  formatMatch?: number
  topicMatch?: number
  risk?: number
}

export default function Results() {
  // --- ALL HOOKS FIRST ---
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)

  // Mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load Session Safely
  useEffect(() => {
    if (!mounted) return

    const data = loadSession()
    if (!data) {
      router.push("/")
    } else {
      setSession(data)
    }
  }, [mounted, router])

  // Guard
  if (!mounted || !session) return null

  // Safe Defaults (formula will NEVER break now)
  const a = Number(session.a) || 1
  const b = Number(session.b) || 1
  const engagement = Number(session.engagement) || 5
  const formatMatch = Number(session.formatMatch) || 70
  const topicMatch = Number(session.topicMatch) || 70
  const risk = Number(session.risk) || 20

  const { final, breakdown } = runCheesecake(
    {
      followers: a,
      engagement,
      formatMatch,
      topicMatch,
      risk
    },
    {
      followers: b,
      engagement,
      formatMatch,
      topicMatch,
      risk
    }
  )

  function label(score: number) {
    if (score > 80) return "Platinum Match"
    if (score > 60) return "High Potential"
    if (score > 40) return "Exploratory"
    return "Low Alignment"
  }

  async function signOut() {
    await supabase.auth.signOut()
    clearSession()
    router.push("/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0218]">

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

      {/* Ambient Glow */}
      <div className="glow top-10 left-10 opacity-30"></div>
      <div className="glow bottom-10 right-10 opacity-30"></div>
      <div className="glow top-1/2 left-1/3 opacity-20"></div>

      {/* Glass Reveal Card */}
      <div
        className="glass w-full max-w-xl p-10 relative z-10
                   bg-black/40 backdrop-blur-2xl border border-purple-400/30
                   text-white shadow-2xl text-center"
      >
        {/* Title */}
        <h2
          className="text-3xl font-extrabold mb-3
                     bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Collaboration Reveal
        </h2>

        <p className="text-purple-200 text-sm mb-8 italic">
          Your creative alignment has been decoded by the Nexfluence engine
        </p>

        {/* Score Orb */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute w-40 h-40 rounded-full border border-purple-400/20 animate-spin-slow" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-pink-400/40 animate-ping" />

          <div
            className="w-24 h-24 rounded-full flex items-center justify-center
                       bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
                       text-4xl font-extrabold text-white
                       shadow-[0_0_40px_rgba(236,72,153,0.9)]"
          >
            {final}
          </div>
        </div>

        {/* Label */}
        <div className="mt-2 text-lg text-purple-200 mb-6">
          {label(final)}
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm text-left text-purple-100 mb-8">
          <p>🌍 Audience Balance: {Math.round(breakdown.audience)}%</p>
          <p>💬 Engagement Quality: {Math.round(breakdown.engagement)}%</p>
          <p>🎨 Content Compatibility: {Math.round(breakdown.content)}%</p>
          <p>🎯 Topic Alignment: {Math.round(breakdown.interest)}%</p>
          <p>⚠️ Risk Penalty: {Math.round(breakdown.risk)}%</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-pink-500
                       hover:from-purple-400 hover:to-pink-400
                       transition transform hover:scale-105 shadow-lg"
            onClick={() => {
              clearSession()
              router.push("/")
            }}
          >
            Explore New Matches
          </button>

          <button
            className="px-6 py-3 rounded-xl font-semibold text-purple-200
                       bg-purple-900/40 border border-purple-400/30
                       hover:bg-purple-900/60 transition transform hover:scale-105"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-purple-300 mt-8 tracking-wide">
          Cheesecake by Nexfluence — turning creative data into collaboration intelligence
        </p>
      </div>
    </main>
  )
}
