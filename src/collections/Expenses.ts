import { CollectionConfig } from 'payload';

const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'expenseType',
  },
  fields: [
    {
      name: 'expenseType',
      type: 'select',
      options: ['Fuel', 'Toll Tax', 'Driver Allowance', 'Maintenance', 'Misc'],
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      required: false,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default Expenses;
