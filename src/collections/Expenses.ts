import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isLoggedIn } from '../access'

export const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'expenseType',
    group: 'Finance',
    defaultColumns: ['expenseType', 'amount', 'date', 'branchName'],
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
        {
          name: 'expenseType',
          type: 'select',
          options: [
            'Fuel',
            'Toll Tax',
            'Driver Allowance',
            'Maintenance',
            'Misc',
            'Electricity',
            'Branch Expense',
          ],
          required: true,
        },
        { name: 'amount', type: 'number', required: true, min: 0 },
        { name: 'date', type: 'date', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'trip',
          type: 'relationship',
          relationTo: 'trips',
          required: false,
        },
        { name: 'branchName', type: 'text' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
