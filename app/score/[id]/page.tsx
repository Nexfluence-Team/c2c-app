"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase"

export default function ScorePage() {
  const { id } = useParams()
  const [me, setMe] = useState<any>(null)
  const [them, setThem] = useState<any>(null)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      const myProfile = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      const theirProfile = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      setMe(myProfile.data)
      setThem(theirProfile.data)
    }
    load()
  }, [id])

  function runScore() {
    const diff = Math.abs(me.followers - them.followers)
    const max = Math.max(me.followers, them.followers)
    const result = Math.max(0, 100 - (diff / max) * 100)
    setScore(Math.round(result))
  }

  if (!me || !them) return <p className="p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow text-center">
        <h1 className="text-xl font-bold mb-4">
          {me.name} × {them.name}
        </h1>

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={runScore}
        >
          Run Compatibility Score
        </button>

        {score !== null && (
          <div className="mt-6">
            <p className="text-gray-500">Compatibility Score</p>
            <p className="text-4xl font-bold">{score}</p>
          </div>
        )}
      </div>
    </main>
  )
}
