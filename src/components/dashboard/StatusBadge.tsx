import React from 'react'

const styles: Record<string, string> = {
  // trip statuses
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 ring-blue-200',
  complete: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  // payment statuses
  unpaid: 'bg-rose-50 text-rose-700 ring-rose-200',
  partial: 'bg-amber-50 text-amber-700 ring-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const labels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  complete: 'Complete',
  unpaid: 'Unpaid',
  partial: 'Partial',
  paid: 'Paid',
}

export default function StatusBadge({ status }: { status?: string | null }) {
  const key = status ?? 'pending'
  const style = styles[key] ?? 'bg-slate-100 text-slate-600 ring-slate-200'
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${style}`}
    >
      {labels[key] ?? key}
    </span>
  )
}
