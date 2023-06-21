import React, { useEffect, useState } from 'react';
import {
  getTodos, addTodo, deleteTodos, updateTodos,
} from '../api/todos';
import ErrorMessage from '../components/ErrorMessage';
import NewTodoInputField from '../components/NewTodoInputField';
import TodosList from '../components/TodosList';
import FooterMenu from '../components/FooterMenu';

import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/TodoItem';
import { Errors } from '../types/Errors';
import TodoItem from '../components/Todo';

export const TodoPage = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.ALL);

  const [errorType, setErrorType] = useState<Errors>(Errors.NULL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleLoadTodos = () => {
    getTodos()
      .then(response => {
        setTodosList(response);
        setVisibleTodos(response);
      })
      .catch(() => setErrorType(Errors.LOAD));
  };

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const handleAddNewTodo = (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    event.preventDefault();

    if (title.trim() !== '') {
      setTempTodo({
        id: 0,
        userId: 0,
        title,
        completed: false,
      });
    } else {
      setErrorType(Errors.EMPTY_TITLE);
    }
  };

  useEffect(() => {
    if (tempTodo) {
      addTodo(tempTodo)
        .then(response => {
          setTodosList(prev => [...prev, response]);
        })
        .catch(() => setErrorType(Errors.ADD));
    }
  }, [tempTodo]);

  const handleDeleteTodo = (ids: number[]) => {
    deleteTodos(ids)
      .then(() => {
        setTodosList(prev => prev.filter(todo => !ids.includes(todo.id)));
      })
      .catch(() => setErrorType(Errors.DELETE));
  };

  const handleClearCompleted = () => {
    const completedTodos = todosList.filter(todo => todo.completed);
    const ids = completedTodos.map(todo => todo.id);

    handleDeleteTodo(ids);
  };

  const handleUpdateTodo = (ids: number[], value: Partial<Todo>) => {
    updateTodos(ids, value)
      .then(() => handleLoadTodos())
      .catch(() => setErrorType(Errors.UPDATE));
  };

  const handleCompleteAll = () => {
    const activeTodos = todosList.filter(todo => !todo.completed);
    const ids = activeTodos.length > 0
      ? activeTodos.map(todo => todo.id)
      : todosList.map(todo => todo.id);

    const currentStatus = activeTodos.length > 0;

    updateTodos(ids, { completed: currentStatus })
      .then(() => handleLoadTodos())
      .catch(() => setErrorType(Errors.UPDATE));
  };

  const handleFilterTodos = (newStatus: TodoStatus) => {
    setStatus(newStatus);

    switch (newStatus) {
      case TodoStatus.COMPLETED:
        setVisibleTodos(todosList.filter(todo => todo.completed));
        break;
      case TodoStatus.ACTIVE:
        setVisibleTodos(todosList.filter(todo => !todo.completed));
        break;
      default:
        setVisibleTodos(todosList);
    }
  };

  useEffect(() => {
    setTempTodo(null);
    handleFilterTodos(status);
  }, [todosList]);

  return (
    <div className="todoapp">
      <div className="todoapp__container">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <NewTodoInputField
            hasTodos={todosList.length > 0}
            isActive={todosList.filter(todo => todo.completed)
              .length === todosList.length}
            handleAddNewTodo={handleAddNewTodo}
            handleCompleteAll={handleCompleteAll}
          />
          {todosList.length > 0 && (
            <>
              <section className="todoapp__main">
                <TodosList
                  visibleTodos={visibleTodos}
                  handleDeleteTodo={handleDeleteTodo}
                  handleUpdateTodo={handleUpdateTodo}
                />
                {tempTodo && <TodoItem todo={tempTodo} isTemp />}
              </section>

              <FooterMenu
                handleFilterTodos={handleFilterTodos}
                handleClearCompleted={handleClearCompleted}
                status={status}
                todosList={todosList}
              />
            </>
          )}
        </div>
        {
          errorType
          && <ErrorMessage
            handleSetError={setErrorType}
            errorType={errorType}
          />
        }
      </div>
    </div>
  );
};
