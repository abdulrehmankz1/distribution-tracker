import { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  slug: 'employees',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'cnic',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
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
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'joiningDate',
      type: 'date',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
