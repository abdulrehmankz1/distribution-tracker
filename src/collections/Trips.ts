import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'tripId',
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        // Generate tripId if not present
        if (data && !data.tripId) {
          data.tripId = `TRIP-${uuidv4().split('-')[0].toUpperCase()}`
        }

        // Auto-calculate totalInvoiceAmount
        if (data?.deliveredItems && Array.isArray(data.deliveredItems)) {
          const payload = req.payload
          let total = 0

          for (const item of data.deliveredItems) {
            if (item.product && item.quantity) {
              const product = await payload.findByID({
                collection: 'products',
                id: item.product,
              })

              const unitPrice = product?.sellingPrice || 0
              const quantity = item.quantity || 0
              const itemTotal = unitPrice * quantity

              item.unitPrice = unitPrice
              item.totalPrice = itemTotal

              total += itemTotal
            }
          }

          data.totalInvoiceAmount = total
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
          name: 'vehicleType',
          type: 'select',
          options: ['Bike', 'Suzuki', 'Mazda', 'Truck', 'Loader Rickshaw', 'Other'],
          required: true,
        },
        {
          name: 'vehicle',
          type: 'relationship',
          relationTo: 'vehicles',
          required: true,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.vehicleType),
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filterOptions: ({ siblingData }: any) => {
            if (siblingData?.vehicleType) {
              return {
                vehicleType: {
                  equals: siblingData.vehicleType,
                },
              }
            }
            return true
          },
        },
      ],
    },
    {
      name: 'deliveredItems',
      type: 'array',
      label: 'Delivered Items',
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
        {
          name: 'unitPrice',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'totalPrice',
          type: 'number',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'totalInvoiceAmount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'invoice',
          label: 'Related Invoice',
          type: 'relationship',
          relationTo: 'invoices',
          required: false,
        },
        {
          name: 'transactions',
          label: 'Related Transactions',
          type: 'relationship',
          relationTo: 'transactions',
          hasMany: true,
          required: false,
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
