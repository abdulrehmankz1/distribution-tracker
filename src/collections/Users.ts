import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrSelf, isLoggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'People',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Data Entry', value: 'dataEntry' },
        { label: 'Viewer', value: 'viewer' },
      ],
      admin: {
        description: 'Controls what this user can see and do across the system.',
      },
      // Only admins can change roles — prevents privilege escalation.
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
}
