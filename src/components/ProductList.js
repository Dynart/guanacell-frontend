import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';

const ProductList = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    getProducts()
      .then(data => {
       
        setProducts(data);
      })
      .catch(err => {
        
        setError('Error al cargar los productos');
      });
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category ? product.category === category : true) &&
    (type ? product.type === type : true)
  );

  // Paginación en el cliente
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      <h4>Productos ({filteredProducts.length})</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
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
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'admin' ? 5 : 4} className="text-center text-muted">
                  No hay productos disponibles.
                </td>
              </tr>
            ) : (
              paginatedProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.type}</td>
                  <td>${(product.price || 0).toFixed(2)}</td>
                  {userRole === 'admin' && (
                    <td>
                      <Link to={`/edit/${product._id}`} className="btn btn-sm btn-warning me-2">
                        Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
         <nav aria-label="Paginación de lista precios" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="btn btn-outline-dark" onClick={() => handlePageChange(currentPage - 1)}>
                Anterior
              </button>
            </li>
            {[...Array(totalPages).keys()].map(i => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="btn btn-outline-dark" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="btn btn-outline-dark" onClick={() => handlePageChange(currentPage + 1)}>
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductList;