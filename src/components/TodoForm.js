import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTodo } from '../services/api';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = { title };
      await addTodo(todoData);
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