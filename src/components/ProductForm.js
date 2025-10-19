import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../services/api';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    type: '',
    price: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createProduct(product);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('No autorizado. Por favor, inicia sesión.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('Acceso denegado: se requiere rol de administrador');
      } else {
        setError(err.response?.data?.message || 'Error al crear el producto');
      }
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Producto</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Nombre del producto o servicio"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Categoría</label>
          <select
            className="form-control"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="Producto Físico">Producto Físico</option>
            <option value="Reparacion">Reparacion</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Tipo</label>
          <select
            className="form-control"
            id="type"
            name="type"
            value={product.type}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="Original">Original</option>
            <option value="Oled">Oled</option>
            <option value="Servicio">Servicio</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            placeholder="Precio"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">Agregar</button>
          <Link to="/" className="btn btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;