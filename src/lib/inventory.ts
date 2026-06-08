import type { Payload, PayloadRequest } from 'payload'

type StockMovement = {
  type: 'In' | 'Out'
  quantity: number
  date: string
  reason?: string
}

/**
 * Adjust the available stock for a product and append a movement log entry.
 *
 * @param delta  positive = stock In (received), negative = stock Out (delivered/sold)
 *
 * If no inventory record exists for the product, one is created automatically.
 * Used by collection hooks (e.g. completing a Trip decrements delivered items).
 */
export async function adjustStock({
  payload,
  productId,
  delta,
  reason,
  req,
}: {
  payload: Payload
  productId: string
  delta: number
  reason: string
  req?: PayloadRequest
}): Promise<void> {
  if (!productId || !delta) return

  const movement: StockMovement = {
    type: delta >= 0 ? 'In' : 'Out',
    quantity: Math.abs(delta),
    date: new Date().toISOString(),
    reason,
  }

  const existing = await payload.find({
    collection: 'inventory',
    where: { product: { equals: productId } },
    limit: 1,
    depth: 0,
    req,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'inventory',
      data: {
        product: productId,
        totalQuantity: Math.max(delta, 0),
        // Never persist negative stock (would fail validation); the movement
        // log still records the full quantity for the audit trail.
        availableQuantity: Math.max(delta, 0),
        movementLogs: [movement],
      },
      req,
    })
    return
  }

  const inv = existing.docs[0]
  const currentLogs = (inv.movementLogs ?? []) as StockMovement[]

  await payload.update({
    collection: 'inventory',
    id: inv.id,
    data: {
      availableQuantity: Math.max(0, (inv.availableQuantity ?? 0) + delta),
      movementLogs: [...currentLogs, movement],
    },
    req,
  })
}
