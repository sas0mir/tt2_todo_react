import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Todo } from '../lib/types';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token');
      console.log('TOKEN->', token);
      try {
        const response = await axios.get('http://api.calmplete.net/api/Todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Your Tasks</h1>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.dueDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;