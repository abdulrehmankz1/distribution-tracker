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
      }
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
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'driver',
          type: 'relationship',
          relationTo: 'employees', // No need for an array, just the string 'employees'
          required: true,
        },
        {
          name: 'helper',
          type: 'relationship',
          relationTo: 'employees', // Same fix here
          required: false,
        },
        ,
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
        { name: 'startTime', type: 'text' },
        { name: 'endTime', type: 'text' },
        { name: 'kmStart', type: 'number' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'kmEnd', type: 'number' },
        { name: 'notes', type: 'textarea' },
      ],
    },
  ],
}

export default Trips
