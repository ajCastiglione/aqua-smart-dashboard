import type { CustomerProfile } from '../api/types'

export const formatFullName = (customer: Pick<CustomerProfile, 'FirstName' | 'LastName'>) =>
  `${customer.FirstName} ${customer.LastName}`.trim()

export const formatStreetAddress = (customer: CustomerProfile) =>
  `${customer.Street}, ${customer.City}, ${customer.State} ${customer.ZipCode}`

export const formatInstallDate = (iso: string | undefined) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
