import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodos, deleteTodo, updateTodo } from '../services/api';

const TodoList = ({ userRole }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      setError('Error al cargar las tareas');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTodo(id);
        fetchTodos();
      } catch (err) {
        setError('Error al eliminar la tarea');
      }
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTodo(id, { completed: !completed });
      fetchTodos();
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  };

  if (loading) return <div className="text-center">Cargando tareas...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Tareas</h2>
        <Link to="/add-todo" className="btn btn-primary">Agregar Tarea</Link>
      </div>
      
      <div className="row">
        {todos.map(todo => (
          <div key={todo._id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className={`card-title ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                      {todo.title}
                    </h5>
                    <small className="text-muted">
                      Creada por: {todo.user} | {new Date(todo.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div>
                    {userRole === 'admin' && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => handleToggleComplete(todo._id, todo.completed)}
                        >
                          {todo.completed ? 'Reabrir' : 'Completar'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(todo._id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">No hay tareas. ¡Agrega la primera!</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;