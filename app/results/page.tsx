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
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const data = loadSession()
    if (!data) router.push("/")
    else setSession(data)
  }, [mounted, router])

  if (!mounted || !session) return null

  const a = Number(session.a) || 1
  const b = Number(session.b) || 1
  const engagement = Number(session.engagement) || 5
  const formatMatch = Number(session.formatMatch) || 70
  const topicMatch = Number(session.topicMatch) || 70
  const risk = Number(session.risk) || 20

  const { final, breakdown } = runCheesecake(
    { followers: a, engagement, formatMatch, topicMatch, risk },
    { followers: b, engagement, formatMatch, topicMatch, risk }
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
    <main
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-[#f4f1ff] via-[#fff0fb] to-[#fff7ea]
                 relative overflow-hidden px-4"
    >
      {/* Logo */}

<div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-20">
  <Image
    src="/logofina.png"
    alt="Nexfluence Logo"
    width={120}
    height={40}
    className="object-contain"
    priority
  />
</div>


      {/* Glass Card */}
      <div
        className="w-full max-w-xl
                   bg-white/65 backdrop-blur-xl
                   border border-white/40
                   rounded-2xl shadow-2xl
                   p-6 sm:p-8 md:p-10 text-center"
      >
        {/* Heading */}
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-2
                     bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
                     bg-clip-text text-transparent"
        >
          Collaboration Reveal
        </h2>

        <p className="text-gray-600 text-sm mb-8">
          Your creative alignment has been decoded by the Nexfluence engine
        </p>

        {/* Score Orb */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute w-44 h-44 rounded-full
                          bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-yellow-300/30
                          blur-2xl animate-pulse" />

          <div className="absolute w-32 h-32 rounded-full
                          border border-purple-300/40 animate-spin-slow" />

          <div
            className="w-24 h-24 rounded-full flex items-center justify-center
                       bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
                       text-4xl font-extrabold text-white
                       shadow-[0_0_40px_rgba(236,72,153,0.6)]"
          >
            {final}
          </div>
        </div>

        {/* Label */}
        <div className="text-lg font-semibold text-pink-500 mb-6">
          {label(final)}
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm text-left text-gray-700 mb-8">
          <p>🌍 Audience Balance: {Math.round(breakdown.audience)}%</p>
          <p>💬 Engagement Quality: {Math.round(breakdown.engagement)}%</p>
          <p>🎨 Content Compatibility: {Math.round(breakdown.content)}%</p>
          <p>🎯 Topic Alignment: {Math.round(breakdown.interest)}%</p>
          <p>⚠️ Risk Penalty: {Math.round(breakdown.risk)}%</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400
                       hover:opacity-90 transition transform hover:scale-[1.03]
                       shadow-lg"
            onClick={() => {
              clearSession()
              router.push("/")
            }}
          >
            Discover Another Creative Match ✨
          </button>

          <button
            className="px-6 py-3 rounded-xl font-semibold
                       bg-white/70 border border-gray-200
                       text-gray-700 hover:bg-white transition"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-8">
          Cheesecake by Nexfluence — turning creative data into collaboration intelligence
        </p>
      </div>
    </main>
  )
}
