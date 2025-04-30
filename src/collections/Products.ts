import { CollectionConfig } from 'payload';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'unit',
      type: 'select',
      options: ['cartons', 'kg', 'litres'],
      required: true,
    },
    {
      name: 'unitPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'expiryDate',
      type: 'date',
    },
  ],
};

export default Products;
