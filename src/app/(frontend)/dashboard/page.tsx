import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Dealer } from '@/payload-types'
import { ExpensesChart, SalesChart } from '@/components/dashboard/Charts'
import KpiCard from '@/components/dashboard/KpiCard'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/format'
import { getDashboardData } from '@/lib/reports'

import LogoutButton from './logout-button'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard — Distribution Tracker',
}

const dealerName = (dealer: Dealer | string | null | undefined): string =>
  dealer && typeof dealer === 'object' ? dealer.name : '—'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  const data = await getDashboardData(payload)

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Distribution<span className="text-indigo-600">Tracker</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user.email}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
                {user.role}
              </span>
            </span>
            <Link
              href="/admin"
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Admin panel
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mb-6 text-sm text-slate-500">Overview of your distribution operations</p>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Trips today" value={String(data.kpis.tripsToday)} accent="indigo" />
          <KpiCard
            label="Pending deliveries"
            value={String(data.kpis.pendingDeliveries)}
            accent="amber"
          />
          <KpiCard
            label="Outstanding"
            value={formatCurrency(data.kpis.outstanding)}
            accent="rose"
            hint="Receivable from dealers"
          />
          <KpiCard
            label="Sales (6 mo)"
            value={formatCurrency(data.kpis.salesWindow)}
            accent="emerald"
          />
          <KpiCard
            label="Month expenses"
            value={formatCurrency(data.kpis.monthExpenses)}
            accent="slate"
          />
          <KpiCard
            label="Low stock"
            value={String(data.kpis.lowStockCount)}
            accent={data.kpis.lowStockCount > 0 ? 'rose' : 'emerald'}
            hint="Items at/below reorder level"
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Sales (last 6 months)</h2>
            <SalesChart data={data.salesByMonth} />
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Expenses by type</h2>
            <ExpensesChart data={data.expensesByType} />
          </div>
        </div>

        {/* Lists */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent trips */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent trips</h2>
            <Table
              head={['Trip', 'Date', 'Dealer', 'Status']}
              rows={data.recentTrips.map((t) => [
                t.tripId ?? '—',
                formatDate(t.date),
                dealerName(t.toLocation as Dealer | string),
                <StatusBadge key={t.id} status={t.tripStatus} />,
              ])}
              empty="No trips yet."
            />
          </section>

          {/* Recent invoices */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent invoices</h2>
            <Table
              head={['Invoice', 'Dealer', 'Amount', 'Status']}
              rows={data.recentInvoices.map((i) => [
                i.invoiceNumber ?? '—',
                dealerName(i.dealer as Dealer | string),
                formatCurrency(i.totalAmount),
                <StatusBadge key={i.id} status={i.paymentStatus} />,
              ])}
              empty="No invoices yet."
            />
          </section>

          {/* Top dealer balances */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Top outstanding balances</h2>
            <Table
              head={['Dealer', 'Balance']}
              rows={data.topDealerBalances.map((d) => [d.dealer, formatCurrency(d.balance)])}
              empty="All settled — no outstanding balances."
            />
          </section>

          {/* Low stock */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Low stock alerts</h2>
            <Table
              head={['Product', 'Available', 'Reorder at']}
              rows={data.lowStock.map((s) => [s.product, String(s.available), String(s.reorder)])}
              empty="Stock levels are healthy."
            />
          </section>
        </div>
      </main>
    </div>
  )
}

function Table({
  head,
  rows,
  empty,
}: {
  head: string[]
  rows: React.ReactNode[][]
  empty: string
}) {
  if (!rows.length) {
    return <p className="py-8 text-center text-sm text-slate-400">{empty}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
            {head.map((h) => (
              <th key={h} className="pb-2 pr-4 font-medium last:text-right">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="py-3 pr-4 text-slate-700 last:pr-0 last:text-right"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
