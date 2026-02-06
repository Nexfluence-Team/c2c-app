"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../lib/supabase"
import { saveSession } from "../lib/session"
import type { ScoreSession } from "../lib/session"
import Select from "../components/Select"
import { PLATFORMS, NICHES, FOLLOWER_RANGES } from "../lib/options"

export default function InputPage() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")

  const [userFollowers, setUserFollowers] = useState<number | null>(null)

  const [platform, setPlatform] = useState("")
  const [niche, setNiche] = useState("")
  const [followersRange, setFollowersRange] = useState("")
  const [profileLink, setProfileLink] = useState("")

  useEffect(() => {
    async function init() {
      setMounted(true)

      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("followers")
        .eq("id", data.user.id)
        .single()

        if (profile?.followers == null) {
  setError("Your follower data is missing. Please update your profile.")
  return
}


      setUserFollowers(profile.followers)
    }

    init()
  }, [router])

  if (!mounted) return null

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  function submit() {
    if (!platform || !niche || !followersRange) {
      setError("Please select platform, niche, and follower range.")
      return
    }

    if (!userFollowers) {
      setError("Unable to read your follower data.")
      return
    }

    const payload: ScoreSession = {
      a: userFollowers,
      b: Number(followersRange),
      engagement: 5,
      formatMatch: 70,
      topicMatch: 70,
      risk: 20
    }

    saveSession(payload)
    router.push("/processing")
  }

  return (
    <main className="min-h-screen flex items-center justify-center
                     bg-gradient-to-br from-[#f4f1ff] via-[#fff0fb] to-[#fff7ea]
                     relative overflow-hidden px-4">

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Image
          src="/logofina.png"
          alt="Nexfluence Logo"
          width={120}
          height={40}
        />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-xl
                      bg-white/65 backdrop-blur-xl
                      border border-white/40
                      rounded-2xl shadow-2xl
                      p-6 sm:p-8 md:p-10">

        {/* Top Bar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={signOut}
            className="text-sm px-4 py-1.5 rounded-full
                       bg-white/60 border border-purple-200
                       text-purple-600 hover:bg-white transition"
          >
            Sign Out
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2
                       bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
                       bg-clip-text text-transparent">
          Discover Your Next Creative Match
        </h2>

        <p className="text-center text-gray-600 text-sm mb-8">
          Choose the details of the creator you want to collaborate with
        </p>

        {/* Form */}
        <div className="space-y-4">

          <Select
            value={platform}
            onChange={setPlatform}
            options={PLATFORMS}
            placeholder="Select platform"
          />

          <Select
            value={niche}
            onChange={setNiche}
            options={NICHES}
            placeholder="Select niche / industry"
          />

          <select
            value={followersRange}
            onChange={e => setFollowersRange(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70
                       border border-gray-200
                       outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select follower range</option>
            {FOLLOWER_RANGES.map(r => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Optional Profile Link */}
          <div className="space-y-1">
            <input
              className="w-full p-3 rounded-xl bg-white/70
                         border border-gray-200
                         outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Creator profile link (optional)"
              onChange={e => setProfileLink(e.target.value)}
            />
            <p className="text-xs text-gray-500 italic">
              For better AI analysis, please enter the profile link
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center mt-4">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400
                     hover:opacity-90 transition transform hover:scale-[1.02]
                     shadow-lg"
        >
          Generate Collaboration Insight
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Cheesecake by Nexfluence — built for creators, brands, and strategists
        </p>
      </div>
    </main>
  )
}
