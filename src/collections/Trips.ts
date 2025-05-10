import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'tripId',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.tripId) {
          data.tripId = `TRIP-${uuidv4().split('-')[0].toUpperCase()}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'tripId',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'tripStatus',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Complete', value: 'complete' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'driver',
          type: 'relationship',
          relationTo: 'employees',
          required: true,
          filterOptions: () => ({
            role: { equals: 'driver' },
          }),
        },
        {
          name: 'helper',
          type: 'relationship',
          relationTo: 'employees',
          required: false,
          filterOptions: () => ({
            role: { equals: 'helper' },
          }),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vehicle',
          type: 'relationship',
          relationTo: 'vehicles',
          required: true,
        },
        {
          name: 'fromLocation',
          type: 'text',
          required: true,
        },
        {
          name: 'toLocation',
          type: 'relationship',
          relationTo: 'dealers',
          required: true,
        },
      ],
    },
    {
      name: 'deliveredItems',
      type: 'array',
      fields: [
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
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
  ],
}

export default Trips
