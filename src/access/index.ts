import type { Access, FieldAccess } from 'payload'

/**
 * Role-based access control helpers.
 *
 * User roles (see Users collection):
 *  - admin      : full control over everything
 *  - manager    : can manage operational data + see financials (cost prices)
 *  - dataEntry   : can create/update day-to-day records, cannot delete or see cost prices
 *  - viewer     : read-only access
 */

type Role = 'admin' | 'manager' | 'dataEntry' | 'viewer'

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null)?.role

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

export const isAdminOrManager: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'manager'
}

/** admin, manager and dataEntry can create/update records (viewer cannot). */
export const canEdit: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'manager' || role === 'dataEntry'
}

/** A user can read/update their own document; admins can do so for anyone. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (roleOf(user) === 'admin') return true
  return { id: { equals: user.id } }
}

// ---- Field-level access ----

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

/** Hide sensitive fields (e.g. cost price) from dataEntry/viewer. */
export const isAdminOrManagerFieldLevel: FieldAccess = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'manager'
}
