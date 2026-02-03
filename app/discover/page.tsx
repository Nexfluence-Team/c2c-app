"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabase"

type Profile = {
  id: string
  name: string
  niche: string
  platform: string
  followers: number
}

export default function Discover() {
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, niche, platform, followers")

      if (data) setProfiles(data)
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Discover Creators</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map(p => (
          <Link
            key={p.id}
            href={`/creator/${p.id}`}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-sm text-gray-500">{p.platform}</p>
            <p className="text-sm">{p.niche}</p>
            <p className="text-sm font-bold mt-2">
              {p.followers} followers
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
