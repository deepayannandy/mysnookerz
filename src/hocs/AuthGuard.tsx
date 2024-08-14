'use client'

import AuthRedirect from '@/components/AuthRedirect'
// Third-party Imports

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const token = localStorage.getItem('token')

  return <>{token ? children : <AuthRedirect lang={locale} />}</>
}
