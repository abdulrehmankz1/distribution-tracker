import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
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
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
    },
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
    {
      name: 'products',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'pricePerUnit', type: 'number', required: true },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentReceived',
      type: 'number',
      required: true,
    },
    {
      name: 'invoiceDate',
      type: 'date',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

export default Invoices
