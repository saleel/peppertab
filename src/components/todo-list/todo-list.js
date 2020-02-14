// @ts-check

import React from 'react';
import EyeIcon from '@iconscout/react-unicons/icons/uil-eye';
import EyeSlashIcon from '@iconscout/react-unicons/icons/uil-eye-slash';
import EnterIcon from '@iconscout/react-unicons/icons/uil-enter';
import Tooltip from 'rc-tooltip';
import useSettings from '../../hooks/use-settings';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import Todo from '../../model/todo';
import TodoItem from '../todo-item';
import Card from '../card';
import { SettingKeys } from '../../constants';
import './todo-list.scss';


function TodoList() {
  const { todoStore } = React.useContext(StoreContext);

  const todoListRef = React.useRef(null);

  const [newTodo, setNewTodo] = React.useState({ title: '' });
  const [showCompleted, setShowCompleted] = useSettings(SettingKeys.showCompletedTodos, true);


  const [todos, { isFetching, reFetch }] = usePromise(() => todoStore.findTodos(), { defaultValue: [] });

  const hasCompleted = todos && todos.some((t) => t.isCompleted);


  React.useEffect(() => {
    const unbind = todoStore.on('sync', () => { reFetch(); });

    return () => { unbind(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  function onCreateChange(e) {
    const title = e.target.value;
    setNewTodo({ title });
  }


  async function saveNewTodo() {
    if (!newTodo.title) return;

    await todoStore.createTodo(new Todo(newTodo));
    setNewTodo({ title: '' });
    await reFetch();
    todoListRef.current.scrollTop = todoListRef.current.scrollHeight;
  }


  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  async function onCreateKeyDown(e) {
    if (e.keyCode === 13) {
      await saveNewTodo();
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


  async function onDeleteClick(todo) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await todoStore.deleteTodo(todo.id);
      reFetch();
    }
  }


  const actions = !hasCompleted ? [] : [
    (
      <Tooltip
        placement="left"
        key="todo-visibility"
        // eslint-disable-next-line react/jsx-one-expression-per-line
        overlay={<div>{showCompleted ? 'Click to hide finished tasks' : 'Click to show finished tasks'}</div>}
        arrowContent={<div className="rc-tooltip-arrow-inner" />}
        overlayClassName="background__tooltip"
      >
        {showCompleted ? (
          <button key="completed" type="button" onClick={() => setShowCompleted(false)}>
            <EyeSlashIcon size="20" />
          </button>
        ) : (
          <button key="completed" type="button" onClick={() => setShowCompleted(true)}>
            <EyeIcon size="20" />
          </button>
        )}
      </Tooltip>
    ),
  ];


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
              onDeleteClick={() => { onDeleteClick(todo); }}
            />
          ))}

          {!isFetching && (filteredTodos.length === 0) && (
            <div className="todo-list__empty">
              {hasCompleted ? (
                <div>
                  Looks like everything is sorted out.
                  <br />
                  You can add more Todos from the box below.
                </div>
              ) : (
                <div>Create a new Todo by typing in the box below.</div>
              )}
            </div>
          )}
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

          <div className="todo-list__enter-icon fade-in">
            {newTodo.title && newTodo.title.length > 0 && (
              <button
                title="Press Enter key to submit"
                type="button"
                className="fade-in"
                onClick={saveNewTodo}
              >
                <EnterIcon />
              </button>
            )}
          </div>
        </div>

      </div>

    </Card>
  );
}


export default React.memo(TodoList);
