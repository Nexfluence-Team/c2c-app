"use client"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    platform: "",
    followers: "",
    niche: ""
  })

  async function saveProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return alert("Not logged in")

    await supabase.from("profiles").upsert({
      id: user.id,
      name: profile.name,
      bio: profile.bio,
      platform: profile.platform,
      followers: Number(profile.followers),
      niche: profile.niche
    })

    alert("Profile saved!")
  }

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile({
          name: data.name || "",
          bio: data.bio || "",
          platform: data.platform || "",
          followers: data.followers || "",
          niche: data.niche || ""
        })
      }
    }

    loadProfile()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h1 className="text-xl font-bold mb-4">Creator Profile</h1>

        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Name"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
        />

        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Bio"
          value={profile.bio}
          onChange={e => setProfile({ ...profile, bio: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Platform (YouTube, TikTok, etc)"
          value={profile.platform}
          onChange={e => setProfile({ ...profile, platform: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Followers"
          value={profile.followers}
          onChange={e => setProfile({ ...profile, followers: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Niche (Tech, Fitness, Art, etc)"
          value={profile.niche}
          onChange={e => setProfile({ ...profile, niche: e.target.value })}
        />

        <button
          className="w-full bg-black text-white py-2 rounded"
          onClick={saveProfile}
        >
          Save Profile
        </button>
      </div>
    </main>
  )
}
