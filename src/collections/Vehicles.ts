import { CollectionConfig } from 'payload';

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
      options: ['Suzuki', 'Mazda', 'Truck', 'Other'],
      required: true,
    },
    {
      name: 'fuelType',
      type: 'select',
      options: ['Petrol', 'Diesel', 'CNG'],
    },
    {
      name: 'average',
      type: 'number',
      required: true,
    },
  ],
};

export default Vehicles;
