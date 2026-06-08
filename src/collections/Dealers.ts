import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isLoggedIn } from '../access'

export const Dealers: CollectionConfig = {
  slug: 'dealers',
  admin: {
    useAsTitle: 'name',
    group: 'People',
    defaultColumns: ['name', 'area', 'phone', 'contactPerson'],
  },
  access: {
    read: isLoggedIn,
    create: canEdit,
    update: canEdit,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'contactPerson', type: 'text' },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'text' },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
