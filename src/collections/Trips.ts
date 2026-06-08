import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

import { canEdit, isAdmin, isLoggedIn } from '../access'
import { adjustStock } from '../lib/inventory'

type DeliveredItem = { product?: string | { id: string } | null; quantity?: number | null }

/** Sum delivered quantities per product id (only when the trip counts as "delivered"). */
const deliveredMap = (items: DeliveredItem[] | null | undefined, active: boolean) => {
  const map = new Map<string, number>()
  if (!active) return map
  for (const it of items ?? []) {
    const id = typeof it.product === 'object' ? it.product?.id : it.product
    if (!id) continue
    map.set(id, (map.get(id) ?? 0) + (Number(it.quantity) || 0))
  }
  return map
}

/**
 * Move inventory from what was previously deducted by this trip to what should
 * be deducted now. One formula covers every case:
 *   - newly completed        → subtract delivered items
 *   - reverted / deleted     → add the items back
 *   - items edited while complete → apply only the difference
 */
const reconcileTripStock = async ({
  payload,
  req,
  tripId,
  prevItems,
  prevComplete,
  nextItems,
  nextComplete,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
  tripId?: string | null
  prevItems: DeliveredItem[] | null | undefined
  prevComplete: boolean
  nextItems: DeliveredItem[] | null | undefined
  nextComplete: boolean
}) => {
  const prev = deliveredMap(prevItems, prevComplete)
  const next = deliveredMap(nextItems, nextComplete)
  const productIds = new Set([...prev.keys(), ...next.keys()])

  for (const productId of productIds) {
    // +ve delta = return to stock, -ve delta = take out of stock
    const delta = (prev.get(productId) ?? 0) - (next.get(productId) ?? 0)
    if (delta === 0) continue
    await adjustStock({
      payload,
      productId,
      delta,
      reason: delta < 0 ? `Delivered — trip ${tripId}` : `Returned — trip ${tripId}`,
      req,
    })
  }
}

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'tripId',
    group: 'Operations',
    defaultColumns: ['tripId', 'date', 'tripStatus', 'toLocation', 'driver'],
  },
  access: {
    read: isLoggedIn,
    create: canEdit,
    update: canEdit,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.tripId) {
          data.tripId = `TRIP-${uuidv4().split('-')[0].toUpperCase()}`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        await reconcileTripStock({
          payload: req.payload,
          req,
          tripId: doc.tripId,
          prevItems: operation === 'update' ? previousDoc?.deliveredItems : [],
          prevComplete: operation === 'update' && previousDoc?.tripStatus === 'complete',
          nextItems: doc.deliveredItems,
          nextComplete: doc.tripStatus === 'complete',
        })
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // A completed trip that gets deleted must return its items to stock.
        await reconcileTripStock({
          payload: req.payload,
          req,
          tripId: doc?.tripId,
          prevItems: doc?.deliveredItems,
          prevComplete: doc?.tripStatus === 'complete',
          nextItems: [],
          nextComplete: false,
        })
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'tripId',
          type: 'text',
          unique: true,
          admin: { readOnly: true },
          // Auto-generated in beforeValidate; never entered by the user.
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'tripStatus',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Complete', value: 'complete' },
          ],
          admin: {
            description: 'Marking a trip "Complete" deducts delivered items from inventory.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fromLocation', type: 'text', required: true },
        {
          name: 'toLocation',
          type: 'relationship',
          relationTo: 'dealers',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'driver',
          type: 'relationship',
          relationTo: 'employees',
          required: true,
          filterOptions: () => ({ role: { equals: 'driver' } }),
        },
        {
          name: 'helper',
          type: 'relationship',
          relationTo: 'employees',
          required: false,
          filterOptions: () => ({ role: { equals: 'helper' } }),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vehicleType',
          type: 'select',
          options: ['Bike', 'Suzuki', 'Mazda', 'Truck', 'Loader Rickshaw', 'Other'],
          required: true,
        },
        {
          name: 'vehicle',
          type: 'relationship',
          relationTo: 'vehicles',
          required: true,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.vehicleType),
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filterOptions: ({ siblingData }: any) => {
            if (siblingData?.vehicleType) {
              return { vehicleType: { equals: siblingData.vehicleType } }
            }
            return true
          },
        },
      ],
    },
    {
      name: 'deliveredItems',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: true,
            },
            { name: 'quantity', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
