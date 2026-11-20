import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastContainer from './components/common/ToastContainer';
import { AppointmentProvider } from './context/AppointmentContext';
import { ToastProvider } from './context/ToastContext';

import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App
 * -----
 * Composição de alto nível: providers globais por fora, layout fixo
 * (Header/Footer), e as rotas da aplicação no meio. Nenhuma lógica de
 * negócio mora aqui — isso é responsabilidade de services/hooks/context.
 */
export default function App() {
  return (
    <ToastProvider>
      <AppointmentProvider>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/confirmacao" element={<ConfirmationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </AppointmentProvider>
    </ToastProvider>
  );
}
