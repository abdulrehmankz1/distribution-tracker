import type { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

import { canEdit, isAdmin, isLoggedIn } from '../access'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    group: 'Finance',
    defaultColumns: ['invoiceNumber', 'dealer', 'totalAmount', 'paymentStatus', 'invoiceDate'],
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
        if (data && !data.invoiceNumber) {
          data.invoiceNumber = `INV-${uuidv4().split('-')[0].toUpperCase()}`
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        // Derive totals so they are always consistent with line items.
        // Fall back to the stored doc so a partial update (e.g. only the
        // payment) doesn't wipe the totals.
        const items = (data.products ?? originalDoc?.products ?? []) as Array<{
          quantity?: number
          pricePerUnit?: number
        }>
        const total = items.reduce(
          (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.pricePerUnit) || 0),
          0,
        )
        const received = Number(data.paymentReceived ?? originalDoc?.paymentReceived) || 0

        data.totalAmount = total
        data.balanceDue = total - received
        data.paymentStatus =
          received <= 0 ? 'unpaid' : received >= total ? 'paid' : 'partial'

        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'invoiceNumber',
          type: 'text',
          unique: true,
          admin: { readOnly: true },
          // Auto-generated in beforeValidate; never entered by the user.
        },
        { name: 'invoiceDate', type: 'date', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dealer',
          type: 'relationship',
          relationTo: 'dealers',
          required: true,
        },
        {
          name: 'trip',
          type: 'relationship',
          relationTo: 'trips',
        },
      ],
    },
    {
      name: 'products',
      type: 'array',
      minRows: 1,
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
            { name: 'pricePerUnit', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'totalAmount',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Auto-calculated from line items.',
          },
        },
        { name: 'paymentReceived', type: 'number', required: true, min: 0, defaultValue: 0 },
        {
          name: 'balanceDue',
          type: 'number',
          admin: { readOnly: true, description: 'Total − payment received.' },
        },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
      ],
      defaultValue: 'unpaid',
      admin: { readOnly: true },
    },
    { name: 'notes', type: 'textarea' },
  ],
}
