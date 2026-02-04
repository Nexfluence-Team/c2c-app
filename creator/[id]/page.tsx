"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function CreatorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      setProfile(data)
    }
    load()
  }, [id])

  if (!profile) return <p className="p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-gray-500">{profile.platform}</p>
        <p className="mt-2">{profile.bio}</p>

        <div className="mt-4 text-sm">
          <p><b>Niche:</b> {profile.niche}</p>
          <p><b>Followers:</b> {profile.followers}</p>
        </div>

        <button
          className="w-full mt-6 bg-black text-white py-2 rounded"
          onClick={() => router.push(`/score/${profile.id}`)}
        >
          Run Compatibility Check
        </button>
      </div>
    </main>
  )
}
