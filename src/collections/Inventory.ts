import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isLoggedIn } from '../access'

/**
 * Live stock per product. `availableQuantity` is kept in sync automatically by
 * stock movements (see src/lib/inventory.ts) — e.g. completing a Trip decrements
 * delivered items. Movement logs provide an audit trail.
 */
export const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'product',
    group: 'Operations',
    defaultColumns: ['product', 'availableQuantity', 'reorderLevel'],
  },
  access: {
    read: isLoggedIn,
    create: canEdit,
    update: canEdit,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'totalQuantity', type: 'number', required: true, min: 0, defaultValue: 0 },
        { name: 'availableQuantity', type: 'number', required: true, min: 0, defaultValue: 0 },
        {
          name: 'reorderLevel',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { description: 'Low-stock alert triggers when available ≤ this value.' },
        },
      ],
    },
    {
      name: 'movementLogs',
      type: 'array',
      admin: {
        description: 'Auto-generated audit trail of stock in/out movements.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'type', type: 'select', options: ['In', 'Out'], required: true },
            { name: 'quantity', type: 'number', required: true, min: 0 },
            { name: 'date', type: 'date', required: true },
          ],
        },
        { name: 'reason', type: 'textarea' },
      ],
    },
  ],
}
