/** Format a number as Pakistani Rupees, e.g. 12500 -> "Rs 12,500". */
export function formatCurrency(value: number | null | undefined): string {
  const n = Number(value) || 0
  return `Rs ${n.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
}

/** Format an ISO date string as a short readable date, e.g. "08 Jun 2026". */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
