import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const CustomerListPage = lazy(() =>
  import('../pages/CustomerListPage').then((pageModule) => ({
    default: pageModule.CustomerListPage,
  })),
)
const CustomerDetailPage = lazy(() =>
  import('../pages/CustomerDetailPage').then((pageModule) => ({
    default: pageModule.CustomerDetailPage,
  })),
)

export const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner label="Loading page" />}>
    <Routes>
      <Route path="/" element={<CustomerListPage />} />
      <Route path="/customers/:customerNumber" element={<CustomerDetailPage />} />
    </Routes>
  </Suspense>
)
