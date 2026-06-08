import type { Payload } from 'payload'

import type { Dealer, Invoice, Trip } from '@/payload-types'

export type DashboardData = {
  kpis: {
    tripsToday: number
    pendingDeliveries: number
    outstanding: number
    lowStockCount: number
    monthExpenses: number
    salesWindow: number
  }
  recentTrips: Trip[]
  recentInvoices: Invoice[]
  topDealerBalances: { dealer: string; balance: number }[]
  lowStock: { product: string; available: number; reorder: number }[]
  salesByMonth: { month: string; total: number }[]
  expensesByType: { type: string; total: number }[]
}

const titleOf = (rel: unknown, key: string): string => {
  if (rel && typeof rel === 'object') {
    return String((rel as Record<string, unknown>)[key] ?? '—')
  }
  return '—'
}

/**
 * Build the dashboard payload. Counts run as DB-side `count` queries, sums and
 * charts are scoped with `where` filters + a rolling 6-month window and trimmed
 * with `select`, so we never load entire collections into memory.
 */
export async function getDashboardData(payload: Payload): Promise<DashboardData> {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    tripsTodayRes,
    pendingRes,
    recentTripsRes,
    recentInvoicesRes,
    openInvoicesRes,
    windowInvoicesRes,
    monthExpensesRes,
    windowExpensesRes,
    inventoryRes,
  ] = await Promise.all([
    payload.count({
      collection: 'trips',
      where: {
        date: {
          greater_than_equal: startOfToday.toISOString(),
          less_than_equal: endOfToday.toISOString(),
        },
      },
    }),
    payload.count({
      collection: 'trips',
      where: { tripStatus: { in: ['pending', 'in_progress'] } },
    }),
    payload.find({ collection: 'trips', limit: 6, sort: '-date', depth: 1 }),
    payload.find({ collection: 'invoices', limit: 6, sort: '-invoiceDate', depth: 1 }),
    // open invoices only (drives outstanding + dealer balances)
    payload.find({
      collection: 'invoices',
      where: { balanceDue: { greater_than: 0 } },
      depth: 1,
      pagination: false,
      select: { balanceDue: true, dealer: true },
    }),
    // last 6 months of invoices (drives sales KPI + chart)
    payload.find({
      collection: 'invoices',
      where: { invoiceDate: { greater_than_equal: sixMonthsAgo.toISOString() } },
      depth: 0,
      pagination: false,
      select: { totalAmount: true, invoiceDate: true },
    }),
    // this month's expenses (sum only)
    payload.find({
      collection: 'expenses',
      where: { date: { greater_than_equal: startOfMonth.toISOString() } },
      depth: 0,
      pagination: false,
      select: { amount: true },
    }),
    // last 6 months of expenses (by-type chart)
    payload.find({
      collection: 'expenses',
      where: { date: { greater_than_equal: sixMonthsAgo.toISOString() } },
      depth: 0,
      pagination: false,
      select: { amount: true, expenseType: true },
    }),
    // inventory is bounded (one row per product)
    payload.find({
      collection: 'inventory',
      depth: 1,
      pagination: false,
      select: { product: true, availableQuantity: true, reorderLevel: true },
    }),
  ])

  const outstanding = openInvoicesRes.docs.reduce((s, i) => s + (i.balanceDue ?? 0), 0)
  const salesWindow = windowInvoicesRes.docs.reduce((s, i) => s + (i.totalAmount ?? 0), 0)
  const monthExpenses = monthExpensesRes.docs.reduce((s, e) => s + (e.amount ?? 0), 0)

  const lowStockItems = inventoryRes.docs.filter(
    (i) => (i.availableQuantity ?? 0) <= (i.reorderLevel ?? 0),
  )

  // Top dealer balances (from open invoices only)
  const dealerMap = new Map<string, number>()
  for (const inv of openInvoicesRes.docs) {
    const name = titleOf(inv.dealer as Dealer | string, 'name')
    dealerMap.set(name, (dealerMap.get(name) ?? 0) + (inv.balanceDue ?? 0))
  }
  const topDealerBalances = [...dealerMap.entries()]
    .map(([dealer, balance]) => ({ dealer, balance }))
    .filter((d) => d.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5)

  // Sales by month (rolling 6 months)
  const monthKeys: { key: string; label: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthKeys.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString('en-GB', { month: 'short' }),
    })
  }
  const salesByMonth = monthKeys.map(({ key, label }) => {
    const total = windowInvoicesRes.docs
      .filter((inv) => {
        if (!inv.invoiceDate) return false
        const d = new Date(inv.invoiceDate)
        return `${d.getFullYear()}-${d.getMonth()}` === key
      })
      .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0)
    return { month: label, total }
  })

  // Expenses by type (rolling 6 months)
  const typeMap = new Map<string, number>()
  for (const e of windowExpensesRes.docs) {
    const type = e.expenseType ?? 'Other'
    typeMap.set(type, (typeMap.get(type) ?? 0) + (e.amount ?? 0))
  }
  const expensesByType = [...typeMap.entries()]
    .map(([type, total]) => ({ type, total }))
    .sort((a, b) => b.total - a.total)

  return {
    kpis: {
      tripsToday: tripsTodayRes.totalDocs,
      pendingDeliveries: pendingRes.totalDocs,
      outstanding,
      lowStockCount: lowStockItems.length,
      monthExpenses,
      salesWindow,
    },
    recentTrips: recentTripsRes.docs,
    recentInvoices: recentInvoicesRes.docs,
    topDealerBalances,
    lowStock: lowStockItems.slice(0, 6).map((i) => ({
      product: titleOf(i.product, 'productName'),
      available: i.availableQuantity ?? 0,
      reorder: i.reorderLevel ?? 0,
    })),
    salesByMonth,
    expensesByType,
  }
}
