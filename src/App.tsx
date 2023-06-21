import React, { useEffect, useState } from 'react';
import { TodoPage } from './pages/TodoPage';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setIsSessionActive(true);
    } else {
      setIsSessionActive(false);
    }
  }, []);

  const handleActiveSession = (isActive: boolean) => {
    setIsSessionActive(isActive);
  };

  return (
    <>
      {(isSessionActive && token)
        ? <>
          <Header handleActiveSession={handleActiveSession} />
          <TodoPage />
        </>
        : <LoginPage handleActiveSession={handleActiveSession} />}
    </>
  );
};
