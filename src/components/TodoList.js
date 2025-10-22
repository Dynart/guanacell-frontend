import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodos, deleteTodo, updateTodo, getCompletedTodo} from '../services/api';

const TodoList = ({ userRole }) => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTodos = async () => {
    try {
          const [activeTodos, completedTodos] = await Promise.all([
        getTodos(),
        getCompletedTodo()
      ]);
      setTodos(activeTodos);
      setCompletedTodos(completedTodos)
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
        if (userRole !== 'admin' && completed) {
        setError('No tienes permiso para desmarcar tareas completadas');
        return;
      }
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
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Ocultar Completadas' : 'Mostrar Completadas'}
          </button>
        </div>
      </div>

<h4>Tareas Pendientes</h4>
      <div className="row">
        {todos.filter(todo => !todo.completed).map(todo => (
          <div key={todo._id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">{todo.title}</h5>
                    <small className="text-muted">
                      Creada por: {todo.createdBy?.username || 'Desconocido'}<br />
                      Asignada a: {todo.assignedTo?.username || 'Nadie'}<br />
                      Creada: {new Date(todo.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  {userRole === 'admin' && (
                    <div>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleToggleComplete(todo._id, todo.completed)}
                      >
                        Completar
                      </button>
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
        ))}
      </div>

            {showCompleted && (
        <>
          <h4 className="mt-4">Tareas Completadas</h4>
          <div className="row">
            {completedTodos.map(todo => (
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
                          Completada: {new Date(todo.updatedAt).toLocaleDateString()}
                        </small>
                      </div>
                      {userRole === 'admin' && (
                        <div>
                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => handleToggleComplete(todo._id, todo.completed)}
                          >
                            Reabrir
                          </button>
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
            ))}
          </div>
        </>
      )}

      {todos.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">No hay tareas. ¡Agrega la primera!</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;