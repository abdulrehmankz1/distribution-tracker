import { CollectionConfig } from 'payload'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'referenceId',
  },
  fields: [
    {
      name: 'referenceId',
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'unitPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'dealer',
      type: 'relationship',
      relationTo: 'dealers',
      required: true,
    },
    {
      name: 'transactionDate',
      type: 'date',
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

export default Transactions
