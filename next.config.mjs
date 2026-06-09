import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Next 15.5's generated route validator clashes with Payload's graphql
    // route handler types. Type-check separately, don't block the build.
    ignoreBuildErrors: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
