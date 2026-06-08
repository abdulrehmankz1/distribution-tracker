import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import LoginForm from './login-form'

export const metadata = {
  title: 'Sign in — Distribution Tracker',
}

export default async function LoginPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (user) redirect('/dashboard')

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            Distribution<span className="text-indigo-600">Tracker</span>
          </Link>
          <p className="mt-2 text-sm text-slate-500">Sign in to your dashboard</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Manage products, deliveries, inventory &amp; invoices
        </p>
      </div>
    </div>
  )
}
