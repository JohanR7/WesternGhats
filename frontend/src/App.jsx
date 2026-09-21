import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPortal from './admin/AdminPortal'
import StorePage from './StorePage'
import PaymentPage from './PaymentPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/western/admin/*" element={<AdminPortal />} />
      </Routes>
    </BrowserRouter>
  )
}
