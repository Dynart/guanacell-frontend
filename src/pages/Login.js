import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {login} from '../services/api';

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      const { token, role } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate('/'); // Redirige a la página principal
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };
  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;