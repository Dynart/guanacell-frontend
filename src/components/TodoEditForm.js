import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import { getTodos, updateTodo, getUsers } from '../services/api';

const TodoEditForm = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodoAndUsers = async () => {
      try {
        const [todos, usersData] = await Promise.all([
          getTodos(),
          userRole === 'admin' ? getUsers() : Promise.resolve([])
        ]);
        const todo = todos.find(t => t._id === id);
        if (todo) {
          setTitle(todo.title);
          setCompleted(todo.completed);
          setAssignedTo(todo.assignedTo?._id || '');
          setUsers(usersData);
          setLoading(false);
        } else {
          setError('Tarea no encontrada');
          setLoading(false);
        }
      } catch (err) {
        setError('Error al cargar la tarea');
        setLoading(false);
      }
    };
    if (userRole === 'admin') {
      fetchTodoAndUsers();
    } else {
      setError('Acceso denegado');
      setLoading(false);
    }
  }, [id, userRole]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = { title, completed, assignedTo: assignedTo || null };
      await updateTodo(id, todoData);
      navigate('/todos', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la tarea');
    }
  };

  if (userRole !== 'admin') return <Link to="/todos" />;
  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Editar Tarea</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título de la Tarea</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="completed" className="form-label">Estado</label>
          <select
            className="form-control"
            id="completed"
            value={completed}
            onChange={(e) => setCompleted(e.target.value === 'true')}
          >
            <option value={false}>Pendiente</option>
            <option value={true}>Completada</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="assignedTo" className="form-label">Asignar a</label>
          <select
            className="form-control"
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Nadie</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Tarea</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/todos')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default TodoEditForm;