import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isAdminOrManagerFieldLevel, isLoggedIn } from '../access'

/**
 * Product catalog. This is the source of truth for product definitions only.
 * Live stock levels live in the Inventory collection (single source of truth),
 * not here.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
    group: 'Catalog',
    defaultColumns: ['productName', 'sku', 'category', 'sellingPrice', 'isActive'],
  },
  access: {
    read: isLoggedIn,
    create: canEdit,
    update: canEdit,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'productName', type: 'text', required: true },
        { name: 'sku', type: 'text', unique: true, label: 'SKU' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'text' },
        {
          name: 'unit',
          type: 'select',
          options: ['cartons', 'kg', 'litres', 'pieces'],
          required: true,
          defaultValue: 'cartons',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'costPrice',
          type: 'number',
          required: true,
          min: 0,
          // Cost price is sensitive — only admins/managers can see it.
          access: { read: isAdminOrManagerFieldLevel },
        },
        { name: 'sellingPrice', type: 'number', required: true, min: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'expiryDate', type: 'date' },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
