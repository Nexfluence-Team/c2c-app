"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../../lib/supabase"

type Profile = {
  name: string
  email?: string
  platform: string
  industry: string
  followers: number
  requests?: string
}

export default function MyAccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [insight, setInsight] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      setMounted(true)

      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setInsight(generateInsight(profileData.followers, profileData.industry))
      }
    }

    loadProfile()
  }, [router])

if (!mounted) return null

if (!profile) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0218] text-white">
      <p className="text-purple-300">
        Loading your profile…
      </p>
    </main>
  )
}


  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0218] relative overflow-hidden">

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Image src="/logofina.png" alt="Nexfluence Logo" width={140} height={50} />
      </div>

      {/* Glow */}
      <div className="glow top-10 left-10 opacity-30"></div>
      <div className="glow bottom-10 right-10 opacity-30"></div>

      {/* Card */}
      <div className="glass w-full max-w-xl p-10 bg-black/40 backdrop-blur-2xl border border-purple-400/30 text-white shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold
                         bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
                         bg-clip-text text-transparent">
            My Account
          </h2>

          <button
            onClick={signOut}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold
                       bg-purple-900/40 border border-purple-400/30
                       text-purple-200 hover:bg-purple-900/60 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-3 text-purple-100">
          <p><span className="text-purple-300">Name:</span> {profile.name}</p>
          <p><span className="text-purple-300">Primary Platform:</span> {profile.platform}</p>
          <p><span className="text-purple-300">Industry / Niche:</span> {profile.industry}</p>
          <p><span className="text-purple-300">Audience Size:</span> {profile.followers.toLocaleString()} followers</p>

          {profile.requests && (
            <p className="mt-2">
              <span className="text-purple-300">Collaboration Goals:</span><br />
              <span className="text-purple-200 italic">{profile.requests}</span>
            </p>
          )}
        </div>

        {/* Insight Box */}
        <div className="mt-8 p-5 rounded-xl
                        bg-gradient-to-r from-purple-900/40 to-pink-900/30
                        border border-purple-400/30">
          <p className="text-sm text-purple-200 italic">
            {insight}
          </p>
        </div>

      {/* Primary Action */}
<div className="mt-10">
  <button
    onClick={() => router.push("/")}
    className="w-full py-4 rounded-2xl font-semibold text-lg text-white
               bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
               hover:from-purple-400 hover:to-pink-400 hover:to-yellow-300
               transition transform hover:scale-[1.03] shadow-xl"
  >
    Discover Your Next Creative Match ✨
  </button>
</div>


        {/* Footer */}
        <p className="text-xs text-purple-300 mt-6 text-center">
          Cheesecake by Nexfluence — your creator identity, decoded
        </p>
      </div>
    </main>
  )
}

/* ------------------ AI-STYLE INSIGHT LOGIC ------------------ */

function generateInsight(followers: number, industry: string) {
  const tier =
    followers < 10000 ? "emerging" :
    followers < 100000 ? "growing" :
    followers < 500000 ? "established" :
    "authority"

  const insights: Record<string, string[]> = {
    emerging: [
      `As an emerging creator in ${industry}, your growth potential is strong — early collaborations can define your long-term influence.`,
      `Your audience may be small, but in ${industry}, authenticity at this stage creates deep trust.`,
    ],
    growing: [
      `You’re gaining real traction in ${industry}. Strategic collaborations can accelerate visibility and brand value.`,
      `Creators at your level often see the highest ROI from well-aligned partnerships.`,
    ],
    established: [
      `With a solid audience base in ${industry}, your profile signals credibility and collaboration leverage.`,
      `Brands and creators alike see profiles like yours as reliable growth multipliers.`,
    ],
    authority: [
      `You’re positioned as an authority in ${industry}. Selective, high-alignment collaborations protect and amplify your influence.`,
      `At this scale, influence isn’t about reach — it’s about strategic impact.`,
    ]
  }

  const pool = insights[tier]
  return pool[Math.floor(Math.random() * pool.length)]
}
