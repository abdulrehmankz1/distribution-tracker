import { CollectionConfig } from 'payload';

const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'tripId',
  },
  fields: [
    {
      name: 'tripId',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
    },
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
      name: 'startTime',
      type: 'text',
    },
    {
      name: 'endTime',
      type: 'text',
    },
    {
      name: 'kmStart',
      type: 'number',
    },
    {
      name: 'kmEnd',
      type: 'number',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default Trips;
