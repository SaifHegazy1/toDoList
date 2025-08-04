import React, { useState, useEffect, useContext, createContext } from 'react';

// Create TodoContext to demonstrate useContext and avoid prop drilling
const TodoContext = createContext();

// Custom hook to demonstrate hooks concept and separation of concerns
function useTodos() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Make a logo bigger", completed: false },
    { id: 2, text: "Launch the Beta version", completed: true },
    { id: 3, text: "Fix the car", completed: false },
    { id: 4, text: "Make a dinner", completed: false }
  ]);

  // Using updater function form as shown in useState document
  const addTodo = (text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: Date.now(), text, completed: false }
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}

// TodoProvider component to provide context
function TodoProvider({ children }) {
  const todoMethods = useTodos();

  return (
    <TodoContext.Provider value={todoMethods}>
      {children}
    </TodoContext.Provider>
  );
}

// AddTodoForm - demonstrates controlled components
function AddTodoForm() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const { addTodo } = useContext(TodoContext);

  // Controlled component - input value managed by React state
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error && e.target.value.length >= 5) {
      setError('');
    }
  };

  const handleSubmit = () => {
    // Validation - minimum 5 characters as shown in image
    if (inputValue.trim().length < 5) {
      setError('Task must be minimum 5 characters');
      return;
    }

    addTodo(inputValue.trim());
    setInputValue(''); // Clear input after adding
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="add-todo-form">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Create new task"
        className="todo-input"
      />
      <button onClick={handleSubmit} className="add-button">Add Task</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

// TodoItem component
function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useContext(TodoContext);

  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />
        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="delete-button"
        aria-label="Delete task"
      >
        🗑️
      </button>
    </div>
  );
}

// TodoList component
function TodoList() {
  const { todos } = useContext(TodoContext);

  if (todos.length === 0) {
    return <div className="empty-state">No tasks yet. Add one above!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

// Main App component
export default function App() {
  // useEffect to demonstrate side effects (could be used for localStorage)
  useEffect(() => {
    console.log('Todo App mounted!');

    // Cleanup function (would run on unmount)
    return () => {
      console.log('Todo App would unmount!');
    };
  }, []); // Empty dependency array - runs once on mount

  return (
    <TodoProvider>
      <div className="app">
        <div className="todo-container">
          <h1 className="app-title">Todo List</h1>
          <AddTodoForm />
          <TodoList />
        </div>
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .todo-container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .app-title {
          text-align: center;
          color: #333;
          margin-bottom: 24px;
          font-size: 28px;
          font-weight: 600;
        }

        .add-todo-form {
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .todo-input {
          flex: 1;
          padding: 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 16px;
          background-color: #f8f9fa;
          outline: none;
          transition: border-color 0.2s;
        }

        .add-button {
          padding: 16px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
        }

        .add-button:hover {
          background: #0056b3;
        }

        .todo-input:focus {
          border-color: #007bff;
          background-color: white;
        }

        .todo-input::placeholder {
          color: #999;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 8px;
          padding: 8px;
          background-color: #f8d7da;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
        }

        .todo-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: background-color 0.2s;
        }

        .todo-item:hover {
          background-color: #e9ecef;
        }

        .todo-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .todo-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .todo-text {
          font-size: 16px;
          color: #333;
          transition: all 0.2s;
        }

        .todo-text.completed {
          text-decoration: line-through;
          color: #6c757d;
        }

        .delete-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .delete-button:hover {
          background: #c82333;
        }

        .empty-state {
          text-align: center;
          color: #6c757d;
          font-style: italic;
          padding: 32px;
        }
      `}</style>
    </TodoProvider>
  );
}