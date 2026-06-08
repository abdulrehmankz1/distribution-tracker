import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isLoggedIn } from '../access'

export const Employees: CollectionConfig = {
  slug: 'employees',
  admin: {
    useAsTitle: 'name',
    group: 'People',
    defaultColumns: ['name', 'role', 'phone', 'active'],
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
        { name: 'name', type: 'text', required: true },
        { name: 'cnic', type: 'text', required: true, unique: true, label: 'CNIC' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Driver', value: 'driver' },
            { label: 'Helper', value: 'helper' },
            { label: 'Data Entry', value: 'data_entry' },
            { label: 'Office Boy', value: 'office_boy' },
            { label: 'Admin', value: 'admin' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        { name: 'joiningDate', type: 'date' },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
