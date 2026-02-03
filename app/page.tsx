"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"
import { saveSession } from "../lib/session"
import Image from "next/image"

export default function InputPage() {
  // --- ALL HOOKS FIRST ---
  const router = useRouter()

  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
    })
  }, [router])

  if (!mounted) return null

  // Allow only positive numbers
  function handleChange(
    value: string,
    setter: (v: string) => void
  ) {
    if (value === "") {
      setter("")
      setError("")
      return
    }
    

    if (!/^\d+$/.test(value)) {
      setError("Numbers only — influence is measured in real audiences, not symbols.")
      return
    }

    setter(value)
    setError("")
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  function submit() {
    if (!a || !b) {
      setError("Both creators need an audience to be matched.")
      return
    }

    const aNum = Number(a)
    const bNum = Number(b)

    if (isNaN(aNum) || isNaN(bNum) || aNum <= 0 || bNum <= 0) {
      setError("Please enter valid, positive follower counts.")
      return
    }

    saveSession({
      a: aNum,
      b: bNum,
      engagement: 5,
      formatMatch: 70,
      topicMatch: 70,
      risk: 20
    })

    router.push("/processing")
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

      {/* Glass Container */}
      <div
        className="glass w-full max-w-xl p-10 relative z-10
                   bg-black/40 backdrop-blur-2xl border border-purple-400/30
                   text-white shadow-2xl"
      >
        {/* Top Bar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={signOut}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold
                       bg-purple-900/40 border border-purple-400/30
                       text-purple-200 hover:bg-purple-900/60
                       transition"
          >
            Sign Out
          </button>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl font-extrabold text-center mb-3
                     bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Creator Compatibility Engine
        </h2>

        <p className="text-center text-purple-200 text-sm mb-8 italic">
          Tell us the scale of each creator’s influence — we’ll handle the strategy.
        </p>

        {/* Creator A */}
        <div className="mb-6">
          <label className="block mb-2 text-yellow-300 font-semibold">
            Creator A — How many people move with their content?
          </label>
          <input
            value={a}
            className={`w-full p-3 rounded-xl outline-none
              bg-yellow-900/20 text-yellow-100 placeholder-yellow-300/70
              transition
              ${error
                ? "border border-red-400 focus:bg-red-900/30"
                : "border border-yellow-400/30 focus:bg-yellow-900/40"}
            `}
            placeholder="Enter follower count (e.g. 125000)"
            onChange={e => handleChange(e.target.value, setA)}
          />
        </div>

        {/* Creator B */}
        <div className="mb-8">
          <label className="block mb-2 text-pink-300 font-semibold">
            Creator B — What’s the size of their digital community?
          </label>
          <input
            value={b}
            className={`w-full p-3 rounded-xl outline-none
              bg-pink-900/20 text-pink-100 placeholder-pink-300/70
              transition
              ${error
                ? "border border-red-400 focus:bg-red-900/30"
                : "border border-pink-400/30 focus:bg-pink-900/40"}
            `}
            placeholder="Enter follower count (e.g. 98000)"
            onChange={e => handleChange(e.target.value, setB)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mb-4 animate-pulse text-center">
            {error}
          </p>
        )}

        {/* Action Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-purple-500 to-pink-500
                     hover:from-purple-400 hover:to-pink-400
                     transition transform hover:scale-105 shadow-lg"
          onClick={submit}
        >
          Generate Collaboration Insight
        </button>

        {/* Footer Copy */}
        <p className="text-center text-xs text-purple-300 mt-6 tracking-wide">
          Cheesecake by Nexfluence — built for creators, brands, and digital strategists
        </p>
      </div>
    </main>
  )
}
