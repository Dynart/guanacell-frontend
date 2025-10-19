import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import EditProduct from './components/EditProduct';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

 
  useEffect(() => {
    console.log('App.js - Estado actual:', { isAuthenticated, userRole });
    // Sincronizar estado con localStorage al cargar la página
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && !isAuthenticated) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, [isAuthenticated, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to={isAuthenticated ? "/" : "/login"}>App Precios</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Lista de Precios</Link>
                  </li>
                  {userRole === 'admin' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/add">Agregar Producto</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={handleLogout}>Cerrar Sesión</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/about">Acerca</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <ProductList userRole={userRole} /> : <Navigate to="/login" />}
          />
          <Route
            path="/add"
            element={isAuthenticated && userRole === 'admin' ? <ProductForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit/:id"
            element={isAuthenticated && userRole === 'admin' ? <EditProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />}
          />
          <Route
            path="/about"
            element={<div><h2>Acerca de</h2><p>App para gestionar precios de productos y servicios.</p></div>}
          />
          <Route
            path="*"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;