import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Distribution Tracker',
  description:
    'Manage products, dealers, deliveries, inventory, invoices and expenses — all in one place.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
