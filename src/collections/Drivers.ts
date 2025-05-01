import { CollectionConfig } from 'payload'

const Drivers: CollectionConfig = {
  slug: 'drivers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'cnic', type: 'text' },
    { name: 'phone', type: 'text', required: true },
    { name: 'vehicleNumber', type: 'text' },
    { name: 'vehicleType', type: 'text' },
  ],
}

export default Drivers
