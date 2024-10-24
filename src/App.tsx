import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TodoPage from './components/TodoPage';

// Функция проверки авторизации
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TodoPage />
            </ProtectedRoute>
          }
        />
        {/* Для корневого пути "/" перенаправляем на страницу задач или логина */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/tasks" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;