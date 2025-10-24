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
      setIsAuthenticated(true);
      setUserRole(role);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };
  return (
    
   
      <div className="container-fluid align-items-center mt-5 w-50 ">
         <div className="card text-center" >
      <div className="mt-4 mb-4">
        <h2>Iniciar Sesión</h2>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form className="" onSubmit={handleSubmit} >
        <div className="mb-5 col-auto">
         
          <input
            type="text"
            className="form-control text-center"
            id="username"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
        
          <input
            type="password"
            className="form-control text-center"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;