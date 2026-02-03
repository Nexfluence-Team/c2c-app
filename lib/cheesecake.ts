function clamp(n: number) {
  if (isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function safe(n: any, fallback = 0) {
  const num = Number(n)
  return isNaN(num) ? fallback : num
}

function audienceScore(a: number, b: number) {
  const A = safe(a, 1)
  const B = safe(b, 1)

  const diff = Math.abs(A - B)
  const max = Math.max(A, B)

  return clamp(100 - (diff / max) * 100)
}

export function runCheesecake(a: any, b: any) {
  const engagement = safe(a.engagement, 5)
  const format = safe(a.formatMatch, 70)
  const frequency = safe(a.topicMatch, 7) * 10
  const risk = safe(a.risk, 20)

  const audience = audienceScore(a.followers, b.followers)

  const final =
    0.25 * audience +
    0.25 * clamp(engagement * 10) +
    0.2 * clamp(format) +
    0.2 * clamp(frequency) -
    0.1 * clamp(risk)

  return {
    final: Math.round(clamp(final)),
    breakdown: {
      audience,
      engagement: clamp(engagement * 10),
      content: clamp(format),
      interest: clamp(frequency),
      risk: clamp(risk)
    }
  }
}
