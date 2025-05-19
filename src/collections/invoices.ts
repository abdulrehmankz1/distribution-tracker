import { CollectionConfig } from 'payload'

const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      required: true,
    },
    {
      name: 'dealer',
      type: 'relationship',
      relationTo: 'dealers',
      required: true,
    },
    {
      name: 'invoiceDate',
      type: 'date',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'totalPrice', type: 'number', required: true },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['unpaid', 'paid', 'partial'],
      required: true,
      defaultValue: 'unpaid',
    },
  ],
}

export default Invoices
