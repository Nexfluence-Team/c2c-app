export function calculateScore(aFollowers, bFollowers) {
  const diff = Math.abs(aFollowers - bFollowers)
  const max = Math.max(aFollowers, bFollowers)

  return Math.max(0, 100 - (diff / max) * 100)
}
