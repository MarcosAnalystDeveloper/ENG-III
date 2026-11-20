import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="container not-found">
      <h1>404</h1>
      <p>Essa página não existe.</p>
      <Link to="/" className="not-found__link">Voltar para o agendamento</Link>
    </div>
  );
}
