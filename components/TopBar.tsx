"use client"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

export default function TopBar() {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center mb-6 text-white">
      <h1 className="font-bold tracking-wide">Cheesecake Platform</h1>

      <div className="space-x-3">
        <button
          className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/40 transition"
          onClick={() => router.push("/")}
        >
          Start Again
        </button>

        <button
          className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/40 transition"
          onClick={() => router.push("/discover")}
        >
          Add Another
        </button>

        <button
          className="px-4 py-1 rounded-full bg-red-400/60 hover:bg-red-500 transition"
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
