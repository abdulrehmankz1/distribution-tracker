import type { CollectionConfig } from 'payload'

import { canEdit, isAdmin, isLoggedIn } from '../access'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'vehicleNumber',
    group: 'Operations',
    defaultColumns: ['vehicleNumber', 'vehicleType', 'fuelType', 'isActive'],
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
        { name: 'vehicleNumber', type: 'text', required: true },
        {
          name: 'vehicleType',
          type: 'select',
          options: ['Bike', 'Suzuki', 'Mazda', 'Truck', 'Loader Rickshaw', 'Other'],
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fuelType',
          type: 'select',
          options: ['Petrol', 'Diesel', 'CNG', 'Electric'],
        },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
