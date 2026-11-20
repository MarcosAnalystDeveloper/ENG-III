import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('Usuário ou senha inválidos.');
    }
  }

  return (
    <div className="container admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1>Painel administrativo</h1>
        <p className="admin-login__hint">
          Acesso restrito à equipe da barbearia. (Demo: usuário <code>admin</code>, senha{' '}
          <code>barbearia123</code>)
        </p>

        <label className="field">
          <span className="field__label">Usuário</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </label>

        <label className="field">
          <span className="field__label">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="admin-login__error">{error}</p>}

        <Button type="submit" fullWidth>Entrar</Button>
      </form>
    </div>
  );
}
