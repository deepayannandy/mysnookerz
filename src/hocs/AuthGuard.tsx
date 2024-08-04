'use client'

// Third-party Imports

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports

export default function AuthGuard({ children }: ChildrenType & { locale?: Locale }) {
  return <>{children}</>
}
