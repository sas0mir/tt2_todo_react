import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';
import { Todo } from '../lib/types';
import { logout } from '../slices/authSlice';
import { addTodo, deleteTodo, updateTodos } from '../slices/todoSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Card, CardContent, IconButton, Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TodoModal from './TodoModal';

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.auth.username);
  const session_token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const fetchTodos = async () => {
    const token = localStorage.getItem('token') || session_token;
    try {
      const response = await axios.get('http://api.calmplete.net/api/Todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
      console.log('TODOS->', response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const saveTodo = async (todo: Todo) => {
    const {id, title, description, dueDate} = todo;
    if (id) {
      //edit
      axios
      .put(`http://api.calmplete.net/api/Todos/${id}`, todo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || session_token}`,
        },
      })
      .then((response) => {
        console.log('Todo updated successfully:', response.data);
        closeModal()
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
    } else {
      //create
      try {
        const response = await axios.post(
          'http://api.calmplete.net/api/Todos',
          {
            title,
            description,
            dueDate,
            isCompleted: false,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || session_token}`,
            },
          },
        );
  
        // Добавляем новую задачу в стейт
        dispatch(addTodo(response.data));
  
        // Закрываем модальное окно
        closeModal();
      } catch (error) {
        console.error('Create todo error:', error);
      }
    }
  };

  const closeModal = () => {
    fetchTodos();
    setShowModal(false);
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    // Определяем, переместилось ли todo в другую колонку (из активных в завершенные или наоборот)
    const sourceColumn = source.droppableId === 'active' ? 'active' : 'completed';
    const destinationColumn =
      destination.droppableId === 'active' ? 'active' : 'completed';

    const draggedTodo = todos[source.index];

    // Если переместили в другую колонку, обновляем isCompleted
    if (sourceColumn !== destinationColumn) {
      draggedTodo.isCompleted = destinationColumn === 'completed';
    }

    // Обновим локальный список todos для перерисовки
    const updatedTodos = Array.from(todos);
    updatedTodos.splice(source.index, 1); // Удаляем элемент из старого места
    updatedTodos.splice(destination.index, 0, draggedTodo); // Вставляем элемент в новое место

    // Обновляем глобальный стейт через redux (или напрямую)
    dispatch(updateTodos(updatedTodos));

    // Отправляем запрос на обновление в API для перемещенного todo
    axios
      .put(`http://api.calmplete.net/api/Todos/${draggedTodo.id}`, {
        title: draggedTodo.title,
        description: draggedTodo.description,
        isCompleted: draggedTodo.isCompleted,
        dueDate: draggedTodo.dueDate
      } , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || session_token}`,
        },
      })
      .then((response) => {
        console.log('Todo updated successfully:', response.data);
        fetchTodos();
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  };

  const handleDeleteTodo = (todo: Todo) => {
    dispatch(deleteTodo(todo))
    axios
      .delete(`http://api.calmplete.net/api/Todos/${todo.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || session_token}`,
        },
      })
      .then((response) => {
        console.log('Todo deleted successfully:', response.data);
        fetchTodos();
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: '1em', m: '1em', display: 'flex', justifyContent: 'space-around' }}>
        <Typography variant='h4'>Your Tasks</Typography>
        <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>Add Todo</Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
      <div className='todo-dragndrop-container'>
        {/* Колонка для незавершённых задач */}
        <Droppable droppableId="active">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className='todo-dragndrop-column'>
              <Typography variant='h4'>Active Todos</Typography>
              {todos.filter(todo => !todo.isCompleted).map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(dragprovided) => (
                    <div
                      ref={dragprovided.innerRef}
                      {...dragprovided.draggableProps}
                      {...dragprovided.dragHandleProps}
                      style={dragprovided.draggableProps.style}
                    >
                      <Card key={todo.id} className='todo-card'>
                        <CardContent className='todo-card-container'>
                          <Box>
                            <Typography variant="h5">{todo.title}</Typography>
                            <Typography variant="body2">{todo.description}</Typography>
                            <Typography variant="body2">Due: {new Date(todo.dueDate).toLocaleDateString()}</Typography>
                          </Box>
                          <Box>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedTodo(todo);
                                setShowModal(true)
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton onClick={() => handleDeleteTodo(todo)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Колонка для завершённых задач */}
        <Droppable droppableId="completed">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className='todo-dragndrop-column'>
              <Typography variant='h4'>Completed Todos</Typography>
              {todos.filter(todo => todo.isCompleted).map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(dragprovided) => (
                    <div
                      ref={dragprovided.innerRef}
                      {...dragprovided.draggableProps}
                      {...dragprovided.dragHandleProps}
                      style={dragprovided.draggableProps.style}
                    >
                      <Card key={todo.id} className='todo-card'>
                        <CardContent className='todo-card-container'>
                          <Box>
                            <Typography variant="h5">{todo.title}</Typography>
                            <Typography variant="body2">{todo.description}</Typography>
                            <Typography variant="body2">Due: {new Date(todo.dueDate).toLocaleDateString()}</Typography>
                          </Box>
                          <Box>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedTodo(todo);
                                setShowModal(true)
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton onClick={() => handleDeleteTodo(todo)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
      <TodoModal open={showModal} handleClose={closeModal} handleSave={saveTodo} initialData={selectedTodo} />
    </div>
  );
};

export default TodoPage;