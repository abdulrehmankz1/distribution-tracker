import { CollectionConfig } from 'payload'

const Dealers: CollectionConfig = {
  slug: 'dealers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'contactPerson', type: 'text' },
    { name: 'phone', type: 'text', required: true },
    { name: 'area', type: 'text' },
  ],
}

export default Dealers
