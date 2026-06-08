import React from 'react'

type KpiCardProps = {
  label: string
  value: string
  hint?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'
}

const accents: Record<NonNullable<KpiCardProps['accent']>, string> = {
  indigo: 'bg-indigo-50 text-indigo-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-700',
}

export default function KpiCard({ label, value, hint, accent = 'slate' }: KpiCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${accents[accent]}`}
      >
        {label}
      </span>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
