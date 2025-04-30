// // collections/Users.ts
// import { CollectionConfig } from 'payload';

// const Users: CollectionConfig = {
//   slug: 'users',
//   admin: {
//     useAsTitle: 'name',  // Using 'name' field as title
//   },
//   fields: [
//     {
//       name: 'name',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'email',
//       type: 'email',
//       required: true,
//     },
//     {
//       name: 'password',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'role',
//       type: 'select',
//       options: [
//         { label: 'Admin', value: 'admin' },
//         { label: 'Data Entry', value: 'dataEntry' },
//         { label: 'Viewer', value: 'viewer' },
//       ],
//       required: true,
//     },
//   ],
// };

// export default Users;
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
