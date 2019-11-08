// @ts-check

import React from 'react';
import EyeIcon from '@iconscout/react-unicons/icons/uil-eye';
import EyeSlashIcon from '@iconscout/react-unicons/icons/uil-eye-slash';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import './todo-list.scss';
import Todo from '../../model/todo';
import TodoItem from '../todo-item';
import Card from '../card';


function TodoList() {
  const { todoStore, lastSyncTime } = React.useContext(StoreContext);
  const [todos, { reFetch }] = useStore(() => todoStore.findTodos(), []);

  const componentRenderedAt = React.useRef(new Date());
  const [newTodo, setNewTodo] = React.useState({ title: '' });
  const [showCompleted, setShowCompleted] = React.useState(false);
  const todoListRef = React.useRef(null);

  const hasCompleted = todos && todos.some((t) => t.isCompleted);


  React.useEffect(() => {
    if (new Date(lastSyncTime).getTime() > componentRenderedAt.current.getTime()) {
      reFetch();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSyncTime]);


  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  function onCreateChange(e) {
    const title = e.target.value;
    setNewTodo({ title });
  }


  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  async function onCreateKeyDown(e) {
    if (e.keyCode === 13) {
      if (!newTodo.title) return;

      await todoStore.createTodo(new Todo(newTodo));
      setNewTodo({ title: '' });
      await reFetch();
      todoListRef.current.scrollTop = todoListRef.current.scrollHeight;
    }
  }


  /**
   * @param {Todo} todo
   * @param {boolean} isCompleted
   */
  async function onCompleteClick(todo, isCompleted) {
    await todoStore.updateTodo(todo.id, { ...todo, isCompleted });
    reFetch();
  }


  const actions = hasCompleted && [
    showCompleted && (
      <button key="completed" type="button" onClick={() => setShowCompleted(false)}>
        <EyeSlashIcon size="20" />
      </button>
    ),
    !showCompleted && (
      <button key="completed" type="button" onClick={() => setShowCompleted(true)}>
        <EyeIcon size="20" />
      </button>
    ),
  ].filter(Boolean);


  const filteredTodos = showCompleted ? todos : todos.filter((t) => !t.isCompleted);


  return (
    <Card title="Todos" actions={actions}>

      <div className="todo-list fade-in">

        <div className="todo-list__items" ref={todoListRef}>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onCompleteClick={(isCompleted) => onCompleteClick(todo, isCompleted)}
            />
          ))}
        </div>

        <div className="todo-list__create">
          <input
            className="todo-list__create-input"
            type="text"
            placeholder="What needs to be done?"
            value={newTodo.title || ''}
            onKeyDown={onCreateKeyDown}
            onChange={onCreateChange}
          />
        </div>

      </div>

    </Card>
  );
}


export default TodoList;
