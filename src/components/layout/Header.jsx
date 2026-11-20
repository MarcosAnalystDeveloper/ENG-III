import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__brand-icon">💈</span>
          <span>{APP_NAME}</span>
        </Link>

        <nav className="site-header__nav">
          <Link
            to="/"
            className={!isAdminArea ? 'is-active' : ''}
          >
            Agendar horário
          </Link>
          <Link
            to="/admin"
            className={isAdminArea ? 'is-active' : ''}
          >
            Painel administrativo
          </Link>
        </nav>
      </div>
    </header>
  );
}
