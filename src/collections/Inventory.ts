import { CollectionConfig } from 'payload'

const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'product',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    { name: 'totalQuantity', type: 'number', required: true },
    { name: 'availableQuantity', type: 'number', required: true },
    {
      name: 'movementLogs',
      type: 'array',
      fields: [
        { name: 'type', type: 'select', options: ['In', 'Out'], required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'date', type: 'date', required: true },
        { name: 'reason', type: 'textarea' },
      ],
    },
  ],
}

export default Inventory
