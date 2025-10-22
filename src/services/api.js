import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Manejo De Los Productos

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

//Manejo Del Login

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

//Manejo de TO-DO

export const getTodos = async () => {
  const response = await api.get('/todos');
  console.log('getTodos response:', response.data);
  return response.data;
};

export const addTodo = async (todoData) => {
  const response = await api.post('/todos', todoData);
  console.log('addTodo response:', response.data);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  console.log('updateTodo response:', response.data);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  console.log('deleteTodo response:', response.data);
  return response.data;
};

export const getCompletedTodo = async () => {
  const response = await api.get('/todos/completed');
  console.log('getCompletedTodo response:', response.data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/todos/users');
  console.log('getUsers response:', response.data);
  return response.data;
};