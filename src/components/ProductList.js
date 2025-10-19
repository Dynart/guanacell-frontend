import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';

const ProductList = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(err => setError('Error al cargar los productos'));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Acceso denegado: se requiere rol de administrador');
        } else {
          setError(err.response?.data?.message || 'Error al eliminar el producto');
        }
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category ? product.category === category : true) &&
    (type ? product.type === type : true)
  );

  return (
    <div className="container mt-4">
      <h2>Lista de Precios</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option value="Producto Físico">Producto Físico</option>
            <option value="Reparacion">Reparacion</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
               <option value="">Selecciona un tipo</option>
            <option value="Original">Original</option>
            <option value="Oled">Oled</option>
            <option value="Servicio">Servicio</option>
          </select>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Tipo de Servicio</th>
            <th>Precio</th>
            {userRole === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.type}</td>
              <td>${product.price}</td>
              
              {userRole === 'admin' && (
                <td>
                  <Link to={`/edit/${product._id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;