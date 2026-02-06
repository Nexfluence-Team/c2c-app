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
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [spark, setSpark] = useState(0)

  // Session Guard
  useEffect(() => {
    const session = loadSession()
    if (!session) router.push("/")
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
    <main
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-[#f4f1ff] via-[#fff0fb] to-[#fff7ea]
                 relative overflow-hidden px-4"
    >

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
      <div
        className="w-full max-w-xl
                   bg-white/65 backdrop-blur-xl
                   border border-white/40
                   rounded-2xl shadow-2xl
                   p-6 sm:p-8 md:p-10"
      >

        {/* Heading */}
        <h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-2
                     bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
                     bg-clip-text text-transparent"
        >
          Creative Magic Engine
        </h2>

        <p className="text-center text-gray-600 text-sm mb-8">
          We’re weaving two creative worlds into one powerful collaboration
        </p>

        {/* Orb */}
        <div className="relative flex justify-center mb-10">

          {/* Soft Halo */}
          <div className="absolute w-56 h-56 rounded-full
                          bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-yellow-300/30
                          blur-2xl animate-pulse" />

          {/* Orbit Ring */}
          <div className="absolute w-44 h-44 rounded-full
                          border border-purple-300/40 animate-spin-slow" />

          {/* Core Orb */}
          <div
            className="w-28 h-28 rounded-full
                       bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
                       shadow-[0_0_60px_rgba(236,72,153,0.6)]
                       animate-pulse"
          />

          {/* Floating Sparks */}
          <span className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-bounce top-0 left-1/2" />
          <span className="absolute w-2 h-2 bg-pink-400 rounded-full animate-bounce bottom-4 right-10" />
          <span className="absolute w-2 h-2 bg-purple-400 rounded-full animate-bounce top-1/3 left-6" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-gray-200 mb-8 overflow-hidden">
          <div
            className="h-full rounded-full
                       bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400
                       transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Spell Feed */}
        <div className="space-y-3">
          {spells.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 text-sm ${
                i === step
                  ? "text-pink-500 font-semibold scale-105"
                  : i < step
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  i < step
                    ? "bg-green-400"
                    : i === step
                    ? "bg-pink-400 animate-pulse"
                    : "bg-gray-300"
                }`}
              />
              {s}
            </div>
          ))}
        </div>

        {/* Spark Meter */}
        <div className="mt-8 text-center text-sm text-gray-600">
          ✨ Creative energy stabilizing —{" "}
          <span className="font-semibold text-pink-500">
            {spark}%
          </span>
        </div>
      </div>
    </main>
  )
}
