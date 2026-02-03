"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { loadSession } from "../../lib/session"

const spells = [
  "Summoning creator energy",
  "Weaving audience threads",
  "Blending content styles",
  "Aligning creative frequencies",
  "Scanning collaboration pathways",
  "Stabilizing influence balance",
  "Sealing the magic match"
]

export default function Processing() {
  // --- ALL HOOKS FIRST ---
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [spark, setSpark] = useState(0)

  // Session Guard
  useEffect(() => {
    const session = loadSession()
    if (!session) {
      router.push("/")
    }
  }, [router])

  // Spell Loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(prev => (prev + 1) % spells.length)
      setProgress(prev => {
        const next = prev + Math.floor(100 / spells.length)
        return next > 100 ? 100 : next
      })
    }, 1100)

    return () => clearTimeout(timer)
  }, [step])

  // Spark Loop
  useEffect(() => {
    const loop = setInterval(() => {
      setSpark(s => (s + 1) % 100)
    }, 90)
    return () => clearInterval(loop)
  }, [])

  // Auto Complete
  useEffect(() => {
    if (progress >= 100) {
      const done = setTimeout(() => {
        router.push("/results")
      }, 1600)
      return () => clearTimeout(done)
    }
  }, [progress, router])

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

      {/* Floating Particles */}
      <div className="glow top-10 left-10 opacity-30"></div>
      <div className="glow bottom-10 right-10 opacity-30"></div>
      <div className="glow top-1/2 left-1/4 opacity-20"></div>

      {/* Magic Engine Card */}
      <div
        className="glass w-full max-w-xl p-10 relative z-10
                   bg-black/40 backdrop-blur-2xl border border-purple-400/30
                   text-white shadow-2xl"
      >
        {/* Title */}
        <h2
          className="text-3xl font-extrabold text-center mb-3
                     bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Creative Magic Engine
        </h2>

        <p className="text-center text-purple-200 text-sm mb-8 italic">
          We’re weaving two creative worlds into one powerful collaboration
        </p>

        {/* Magic Orb */}
        <div className="relative flex justify-center mb-10">
          {/* Outer Halo */}
          <div className="absolute w-60 h-60 rounded-full border border-purple-400/20 animate-spin-slow" />

          {/* Glow Ring */}
          <div className="absolute w-44 h-44 rounded-full border-2 border-pink-400/40 animate-ping" />

          {/* Core */}
          <div
            className="w-32 h-32 rounded-full
                       bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
                       animate-pulse shadow-[0_0_50px_rgba(236,72,153,0.9)]"
          />

          {/* Floating Sparks */}
          <div className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-bounce top-0 left-1/2" />
          <div className="absolute w-2 h-2 bg-pink-300 rounded-full animate-bounce bottom-2 right-1/4" />
          <div className="absolute w-2 h-2 bg-purple-300 rounded-full animate-bounce top-1/3 left-4" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-purple-900/40 mb-8 overflow-hidden">
          <div
            className="h-full rounded-full
                       bg-gradient-to-r from-purple-500 to-pink-500
                       transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Spell Feed */}
        <div className="space-y-3">
          {spells.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                i === step
                  ? "text-pink-300 scale-105"
                  : i < step
                  ? "text-green-300"
                  : "text-white/40"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  i < step
                    ? "bg-green-400"
                    : i === step
                    ? "bg-pink-400 animate-pulse"
                    : "bg-white/30"
                }`}
              />
              {s}
            </div>
          ))}
        </div>

        {/* Spark Meter */}
        <div className="mt-8 text-center text-sm text-purple-300 tracking-wide">
          ✨ Creative energy stabilizing —{" "}
          <span className="text-pink-400">{spark}</span>%
        </div>
      </div>
    </main>
  )
}
