import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

const Icon = ({ path }: { path: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden
  >
    {path.split('|').map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
)

const features = [
  {
    title: 'Deliveries that update stock',
    desc: 'Mark a trip delivered and the cartons leave your inventory on their own — no second register, no double entry.',
    path: 'M3 7h11v8H3z|M14 10h3.5L21 13v2h-7|M6 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z|M17 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z',
  },
  {
    title: 'Dealer balances you can trust',
    desc: 'Every invoice tracks what is paid and what is still due. See each dealer’s outstanding without reaching for a calculator.',
    path: 'M4 5h16v14H4z|M4 9h16|M8 14h5',
  },
  {
    title: 'A warning before stock runs out',
    desc: 'Set a reorder level per product. The dashboard flags whatever is getting low so you order in time, not after a stockout.',
    path: 'M6 9a6 6 0 0 1 12 0c0 4.5 2 5.5 2 5.5H4S6 13.5 6 9z|M10 20a2 2 0 0 0 4 0',
  },
  {
    title: 'The whole operation in one place',
    desc: 'Drivers, helpers, vehicles and expenses — all linked together, with roles so each person only sees what they should.',
    path: 'M9 10a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z|M3 19v-1a5 5 0 0 1 10 0v1|M16 5.2a2.6 2.6 0 0 1 0 4.8|M21 19v-1a5 5 0 0 0-4-4.4',
  },
]

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  const primaryHref = user ? '/dashboard' : '/login'
  const primaryLabel = user ? 'Open the dashboard' : 'Sign in'

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-semibold tracking-tight text-slate-900">
          Distribution<span className="text-indigo-600">Tracker</span>
        </span>
        <Link
          href={primaryHref}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {user ? 'Dashboard' : 'Sign in'}
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          {/* Left: copy */}
          <div>
            <p className="text-sm font-medium text-indigo-600">For distributors &amp; wholesalers</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Know where every delivery, rupee and carton actually is.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Distribution Tracker keeps your trips, stock and dealer payments in step with each
              other — so you stop reconciling numbers across registers, calculators and WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primaryHref}
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {primaryLabel}
              </Link>
              <Link
                href="/admin"
                className="rounded-md px-5 py-2.5 text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
              >
                Open the admin panel →
              </Link>
            </div>
          </div>

          {/* Right: dashboard preview mock */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="ml-2 text-xs text-slate-400">Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <PreviewStat label="Trips today" value="6" tone="text-indigo-600" />
                <PreviewStat label="Outstanding" value="Rs 84,200" tone="text-rose-600" />
                <PreviewStat label="Low stock" value="2" tone="text-amber-600" />
              </div>
              <div className="mt-3 rounded-lg border border-slate-100 p-3">
                <p className="mb-2 text-[11px] font-medium text-slate-400">Sales — last 6 months</p>
                <div className="flex h-24 items-end gap-2">
                  {[38, 52, 44, 67, 58, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-indigo-500/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  ['TRIP-9F2A', 'Al-Madina Store', 'Complete'],
                  ['TRIP-7C10', 'New Karachi Mart', 'In Progress'],
                ].map(([id, dealer, status]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-slate-700">{id}</span>
                    <span className="text-slate-400">{dealer}</span>
                    <span
                      className={
                        status === 'Complete'
                          ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700'
                          : 'rounded-full bg-blue-100 px-2 py-0.5 text-blue-700'
                      }
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-slate-900">
            Built around how a distribution business actually runs
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 ring-1 ring-slate-200">
                  <Icon path={f.path} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Distribution Tracker</span>
        <Link href={primaryHref} className="text-slate-500 hover:text-slate-700">
          {user ? 'Go to dashboard' : 'Sign in to your account'}
        </Link>
      </footer>
    </div>
  )
}

function PreviewStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${tone}`}>{value}</p>
    </div>
  )
}
