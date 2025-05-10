import { CollectionConfig } from 'payload'

const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'vehicleNumber',
  },
  fields: [
    {
      name: 'vehicleNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'vehicleType',
      type: 'select',
      options: ['Bike', 'Suzuki', 'Mazda', 'Truck', 'Loader Rickshaw', 'Other'],
      required: true,
    },
    {
      name: 'fuelType',
      type: 'select',
      options: ['Petrol', 'Diesel', 'CNG', 'Electric'],
    },
  ],
}

export default Vehicles
