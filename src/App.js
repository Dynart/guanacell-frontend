import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import EditProduct from './components/EditProduct';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoEditForm from './components/TodoEditForm';
import CompletedTodoList from './components/CompletedTodoList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

 
  useEffect(() => {
    // Sincronizar estado con localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && !isAuthenticated) {
      setIsAuthenticated(true);
      setUserRole(role || null);
    } else if (!token && isAuthenticated) {
      setIsAuthenticated(false);
      setUserRole(null);
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
      
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} handleLogout={handleLogout}/>
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

             <Route
            path="/todos"
            element={isAuthenticated ? <TodoList userRole={userRole} /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-todo"
            element={isAuthenticated ? <TodoForm userRole={userRole} /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-todo/:id"
            element={isAuthenticated ? <TodoEditForm userRole={userRole} /> : <Navigate to="/login" />}
          />

           <Route
          path="/completed"
          element={isAuthenticated ? <CompletedTodoList userRole={userRole} /> : <Navigate to="/login" />}
        />

        </Routes>
        
      </div>
 
    </Router>
  );
}

export default App;