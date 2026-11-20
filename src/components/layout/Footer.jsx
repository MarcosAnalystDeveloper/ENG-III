import { APP_NAME } from '../../utils/constants';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>💈 {APP_NAME}</span>
        <span className="site-footer__muted">
          Projeto acadêmico — Engenharia de Software III
        </span>
      </div>
    </footer>
  );
}
