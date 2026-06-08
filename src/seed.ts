import { getPayload } from 'payload'

import config from './payload.config'

/**
 * Seed demo data for local development / portfolio demos.
 *
 * Run with:  pnpm seed
 *
 * Idempotent: clears operational collections and (re)creates a known set of
 * dealers, products, employees, vehicles, inventory, trips, invoices and
 * expenses. Demo users are upserted (existing ones are kept).
 */

const PASSWORD = 'password123'

const monthsAgo = (n: number, day = 15) => {
  const d = new Date()
  d.setMonth(d.getMonth() - n, day)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

const pick = <T,>(arr: readonly T[], i: number): T => arr[i % arr.length]

const seed = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('🌱 Seeding demo data…')

  // --- Demo users (upsert by email) ---
  const demoUsers = [
    { email: 'admin@demo.com', role: 'admin' as const, name: 'Demo Admin' },
    { email: 'manager@demo.com', role: 'manager' as const, name: 'Demo Manager' },
    { email: 'viewer@demo.com', role: 'viewer' as const, name: 'Demo Viewer' },
  ]
  for (const u of demoUsers) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: u.email } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'users', data: { ...u, password: PASSWORD } })
      payload.logger.info(`  created user ${u.email} / ${PASSWORD}`)
    }
  }

  // --- Clear operational collections ---
  const clearable = [
    'expenses',
    'invoices',
    'trips',
    'inventory',
    'vehicles',
    'employees',
    'dealers',
    'products',
  ] as const
  for (const collection of clearable) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  // --- Products ---
  const productSpecs: {
    productName: string
    sku: string
    category: string
    unit: 'cartons' | 'kg' | 'litres' | 'pieces'
    costPrice: number
    sellingPrice: number
  }[] = [
    { productName: 'Cooking Oil 5L', sku: 'OIL-5L', category: 'Grocery', unit: 'cartons', costPrice: 1200, sellingPrice: 1450 },
    { productName: 'Basmati Rice 25kg', sku: 'RICE-25', category: 'Grocery', unit: 'kg', costPrice: 4200, sellingPrice: 4800 },
    { productName: 'Tea Pack 950g', sku: 'TEA-950', category: 'Beverages', unit: 'cartons', costPrice: 950, sellingPrice: 1150 },
    { productName: 'Mineral Water 1.5L', sku: 'WATER-15', category: 'Beverages', unit: 'litres', costPrice: 45, sellingPrice: 70 },
    { productName: 'Biscuit Family Pack', sku: 'BISC-FP', category: 'Snacks', unit: 'cartons', costPrice: 600, sellingPrice: 780 },
    { productName: 'Detergent 1kg', sku: 'DET-1KG', category: 'Home Care', unit: 'pieces', costPrice: 320, sellingPrice: 420 },
  ]
  const products = []
  for (const p of productSpecs) {
    products.push(await payload.create({ collection: 'products', data: { ...p, isActive: true } }))
  }

  // --- Inventory (initial stock) ---
  const stock = [200, 80, 150, 500, 120, 90]
  for (let i = 0; i < products.length; i++) {
    await payload.create({
      collection: 'inventory',
      data: {
        product: products[i].id,
        totalQuantity: stock[i],
        availableQuantity: stock[i],
        reorderLevel: [40, 20, 30, 100, 25, 20][i],
        movementLogs: [
          { type: 'In', quantity: stock[i], date: monthsAgo(6, 1), reason: 'Opening stock' },
        ],
      },
    })
  }

  // --- Dealers ---
  const dealerSpecs = [
    { name: 'Al-Madina Store', area: 'Saddar', phone: '0300-1112233', contactPerson: 'Bilal', address: 'Shop 12, Saddar Bazaar' },
    { name: 'New Karachi Mart', area: 'North Nazimabad', phone: '0301-2223344', contactPerson: 'Asad', address: 'Block H, North Nazimabad' },
    { name: 'Friends General Store', area: 'Gulshan', phone: '0302-3334455', contactPerson: 'Kamran', address: 'Main Univ. Road, Gulshan' },
    { name: 'City Cash & Carry', area: 'Clifton', phone: '0303-4445566', contactPerson: 'Salman', address: 'Block 5, Clifton' },
    { name: 'Bismillah Traders', area: 'Korangi', phone: '0304-5556677', contactPerson: 'Imran', address: 'Sector 31, Korangi' },
  ]
  const dealers = []
  for (const d of dealerSpecs) {
    dealers.push(await payload.create({ collection: 'dealers', data: { ...d, isActive: true } }))
  }

  // --- Employees ---
  const employeeSpecs = [
    { name: 'Rashid Ali', cnic: '42101-1111111-1', phone: '0311-1111111', role: 'driver' as const },
    { name: 'Naveed Khan', cnic: '42101-2222222-2', phone: '0311-2222222', role: 'driver' as const },
    { name: 'Faisal Ahmed', cnic: '42101-3333333-3', phone: '0311-3333333', role: 'helper' as const },
    { name: 'Junaid Iqbal', cnic: '42101-4444444-4', phone: '0311-4444444', role: 'helper' as const },
    { name: 'Saad Hussain', cnic: '42101-5555555-5', phone: '0311-5555555', role: 'data_entry' as const },
    { name: 'Owais Raza', cnic: '42101-6666666-6', phone: '0311-6666666', role: 'office_boy' as const },
  ]
  const employees = []
  for (const e of employeeSpecs) {
    employees.push(
      await payload.create({
        collection: 'employees',
        data: { ...e, active: true, joiningDate: monthsAgo(12, 1) },
      }),
    )
  }
  const drivers = employees.filter((e) => e.role === 'driver')
  const helpers = employees.filter((e) => e.role === 'helper')

  // --- Vehicles ---
  const vehicleSpecs: {
    vehicleNumber: string
    vehicleType: 'Bike' | 'Suzuki' | 'Mazda' | 'Truck' | 'Loader Rickshaw' | 'Other'
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
  }[] = [
    { vehicleNumber: 'KHI-1234', vehicleType: 'Suzuki', fuelType: 'Petrol' },
    { vehicleNumber: 'KHI-5678', vehicleType: 'Mazda', fuelType: 'Diesel' },
    { vehicleNumber: 'KHI-9012', vehicleType: 'Loader Rickshaw', fuelType: 'CNG' },
    { vehicleNumber: 'KHI-3456', vehicleType: 'Truck', fuelType: 'Diesel' },
  ]
  const vehicles = []
  for (const v of vehicleSpecs) {
    vehicles.push(await payload.create({ collection: 'vehicles', data: { ...v, isActive: true } }))
  }

  // --- Trips (mix of statuses; complete ones decrement stock via hook) ---
  const statuses = ['complete', 'complete', 'in_progress', 'pending', 'complete', 'complete', 'in_progress', 'complete'] as const
  const trips = []
  for (let i = 0; i < 8; i++) {
    const veh = pick(vehicles, i)
    const t = await payload.create({
      collection: 'trips',
      data: {
        date: monthsAgo(i % 6, 5 + (i % 20)),
        tripStatus: statuses[i],
        fromLocation: 'Main Warehouse, Karachi',
        toLocation: pick(dealers, i).id,
        driver: pick(drivers, i).id,
        helper: pick(helpers, i).id,
        vehicleType: veh.vehicleType,
        vehicle: veh.id,
        deliveredItems: [
          { product: pick(products, i).id, quantity: 5 + (i % 5) },
          { product: pick(products, i + 1).id, quantity: 3 + (i % 4) },
        ],
        notes: i % 2 === 0 ? 'Delivered on time.' : undefined,
      },
    })
    trips.push(t)
  }

  // --- Invoices (mixed payment states across last 6 months) ---
  for (let i = 0; i < 8; i++) {
    const p1 = pick(products, i)
    const p2 = pick(products, i + 2)
    const qty1 = 4 + (i % 6)
    const qty2 = 2 + (i % 4)
    const total = qty1 * p1.sellingPrice + qty2 * p2.sellingPrice
    // vary payment: some paid, some partial, some unpaid
    const received = i % 3 === 0 ? total : i % 3 === 1 ? Math.round(total * 0.5) : 0
    await payload.create({
      collection: 'invoices',
      data: {
        invoiceDate: monthsAgo(i % 6, 6 + (i % 18)),
        dealer: pick(dealers, i).id,
        trip: pick(trips, i).id,
        products: [
          { product: p1.id, quantity: qty1, pricePerUnit: p1.sellingPrice },
          { product: p2.id, quantity: qty2, pricePerUnit: p2.sellingPrice },
        ],
        paymentReceived: received,
      },
    })
  }

  // --- Expenses ---
  const expenseTypes = ['Fuel', 'Toll Tax', 'Driver Allowance', 'Maintenance', 'Electricity', 'Branch Expense'] as const
  for (let i = 0; i < 12; i++) {
    await payload.create({
      collection: 'expenses',
      data: {
        expenseType: pick(expenseTypes, i),
        amount: 1500 + (i % 6) * 800,
        date: monthsAgo(i % 6, 10 + (i % 15)),
        trip: i % 2 === 0 ? pick(trips, i).id : undefined,
        branchName: 'Karachi Main',
      },
    })
  }

  payload.logger.info('✅ Seed complete. Login at /admin or /login with admin@demo.com / password123')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
