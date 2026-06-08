import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * List users, and optionally reset a user's password — without needing email.
 *
 * List all users:
 *   pnpm reset-password
 *
 * Reset a password:
 *   RESET_EMAIL=you@example.com RESET_PASSWORD=newpass123 pnpm reset-password
 */
const run = async () => {
  const payload = await getPayload({ config })

  const email = process.env.RESET_EMAIL
  const password = process.env.RESET_PASSWORD

  const users = await payload.find({ collection: 'users', limit: 100, depth: 0 })

  payload.logger.info(`Found ${users.totalDocs} user(s):`)
  for (const u of users.docs) {
    payload.logger.info(`  • ${u.email}  (role: ${u.role ?? 'n/a'})`)
  }

  if (!email || !password) {
    payload.logger.info(
      'To reset: RESET_EMAIL=<email> RESET_PASSWORD=<newPassword> pnpm reset-password',
    )
    process.exit(0)
  }

  const match = users.docs.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (!match) {
    payload.logger.error(`No user found with email "${email}".`)
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: match.id,
    data: { password },
  })
  payload.logger.info(`✅ Password for ${match.email} has been reset.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
