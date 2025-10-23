import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTodo, getUsers } from '../services/api';

const TodoForm = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
      const fetchUsers = async () => {
        try {
          const data = await getUsers();
          setUsers(data);
        } catch (err) {
          setError('Error al cargar usuarios');
        }
      };
      fetchUsers();
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = { title };
      if (assignedTo) {
        todoData.assignedTo = assignedTo;
      }
      
      await addTodo(todoData);
      setError(null);
      navigate('/todos', { replace: true });
    } catch (err) {
      
      setError(err.response?.data?.message || 'Error al agregar la tarea');
    }
  };


 return (
    <div className="container mt-4">
      <h2>Agregar Tarea</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título de la Tarea</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe la tarea..."
            required
          />
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
        <button type="submit" className="btn btn-primary">Agregar Tarea</button>
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

export default TodoForm;