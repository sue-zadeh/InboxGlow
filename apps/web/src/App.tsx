import { Navigate, Route, Routes } from 'react-router-dom'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import LegalPage from './pages/LegalPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ContactPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
