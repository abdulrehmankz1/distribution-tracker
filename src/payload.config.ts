import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Products from './collections/Products'
import Dealers from './collections/Dealers'
import Vehicles from './collections/Vehicles'
import Trips from './collections/Trips'
import Expenses from './collections/Expenses'
import Inventory from './collections/Inventory'
import { Employees } from './collections/Employees'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Dealers,
    Vehicles,
    Employees,
    Trips,
    Expenses,
    Inventory,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [payloadCloudPlugin()],
})
