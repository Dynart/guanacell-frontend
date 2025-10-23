import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompletedTodo, deleteTodo, updateTodo } from '../services/api';

const CompletedTodoList = ({ userRole }) => {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tasksPerPage = 6;

  const fetchCompletedTodos = async () => {
    try {
      setLoading(true);
      const completedTodos = await getCompletedTodo();
      
      setCompletedTodos(completedTodos);
      setLoading(false);
    } catch (err) {
      
      setError('Error al cargar las tareas completadas');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTodos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTodo(id);
        fetchCompletedTodos();
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
        setError('Error al eliminar la tarea');
      }
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const newCompleted = !completed;
      
      await updateTodo(id, { completed: newCompleted });
      fetchCompletedTodos();
    } catch (err) {
      
      setError(err.response?.data?.message || 'Error al actualizar la tarea');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Paginación en el cliente
  const totalPages = Math.ceil(completedTodos.length / tasksPerPage);
  const paginatedTodos = completedTodos.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      console.log(`Cambiando a página ${page}`);
    }
  };

  if (loading) return <div className="text-center">Cargando tareas completadas...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tareas Completadas</h2>
        <div>
          <Link to="/todos" className="btn btn-secondary">
            Volver a Tareas Pendientes
          </Link>
        </div>
      </div>

      <h4>Tareas Completadas ({completedTodos.length})</h4>
      <div className="row">
        {paginatedTodos.length === 0 ? (
          <div className="text-center mt-4">
            <p className="text-muted">No hay tareas completadas.</p>
          </div>
        ) : (
          paginatedTodos.map(todo => (
            <div key={todo._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title text-decoration-line-through text-muted">
                        {todo.title}
                      </h5>
                      <small className="text-muted">
                        Creada por: {todo.createdBy?.username || 'Desconocido'}<br />
                        Asignada a: {todo.assignedTo?.username || 'Nadie'}<br />
                        Completada: {formatDateTime(todo.updatedAt)}
                      </small>
                    </div>
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleToggleComplete(todo._id, todo.completed)}
                      >
                        Reabrir
                      </button>
                      {userRole === 'admin' && (
                        <div>
                          <Link
                            to={`/edit-todo/${todo._id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Editar
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(todo._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Paginación de tareas completadas" className="mt-4">
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

export default CompletedTodoList;