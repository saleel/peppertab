// @ts-check

import React from 'react';
import EyeIcon from '@iconscout/react-unicons/icons/uil-eye';
import EyeSlashIcon from '@iconscout/react-unicons/icons/uil-eye-slash';
import EnterIcon from '@iconscout/react-unicons/icons/uil-enter';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Tooltip from 'rc-tooltip';
import arrayMove from 'array-move';
import useSettings from '../../hooks/use-settings';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import Todo from '../../model/todo';
import TodoItem from '../todo-item';
import Card from '../card';
import { SettingKeys } from '../../constants';
import './todo-list.scss';


const SortableTodoItem = SortableElement(TodoItem);
const SortableList = SortableContainer(({ children }) => <ul>{children}</ul>);


function TodoList() {
  const { todoStore } = React.useContext(StoreContext);

  const todoListRef = React.useRef(null);

  const [newTodo, setNewTodo] = React.useState({ title: '' });
  const [showCompleted, setShowCompleted] = useSettings(SettingKeys.showCompletedTodos, true);


  const [todosFromStore, { isFetching, reFetch }] = usePromise(() => todoStore.findTodos(), { defaultValue: [] });

  const [todos, setTodos] = React.useState(todosFromStore);

  const hasCompleted = todos && todos.some((t) => t.isCompleted);


  React.useEffect(() => {
    setTodos(todosFromStore);
  }, [todosFromStore]);


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

    const order = todos.filter((t) => !t.isCompleted).length;
    await todoStore.createTodo(new Todo({ ...newTodo, order }));
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
   * @param {String} todoId
   * @param {Object} data
   */
  async function onUpdate(todoId, data) {
    await todoStore.updateTodo(todoId, data);
    if (data.isCompleted === undefined) {
      reFetch();
    }
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


  const completedTodos = todos.filter((t) => t.isCompleted);
  const activeTodos = todos.filter((t) => !t.isCompleted);


  async function onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }

    const newTodoList = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodoList);

    await Promise.all(newTodoList.map((n, i) => todoStore.updateTodo(n.id, { order: i })));
    reFetch();
  }


  return (
    <Card title="Todos" actions={actions}>

      <div className="todo-list fade-in">

        <div className="todo-list__items" ref={todoListRef}>

          <SortableList
            helperClass="todo-item--dragged"
            onSortEnd={onSortEnd}
            useDragHandle
            lockAxis="y"
            lockToContainerEdges
            lockOffset="0%"
          >
            {activeTodos.map((todo, index) => (
              <SortableTodoItem
                key={todo.id}
                index={index}
                todo={todo}
                onUpdate={(data) => onUpdate(todo.id, data)}
                onDeleteClick={() => { onDeleteClick(todo); }}
              />
            ))}
          </SortableList>

          {showCompleted && completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={(data) => onUpdate(todo.id, data)}
              onDeleteClick={() => { onDeleteClick(todo); }}
            />
          ))}

          {!isFetching && ((showCompleted ? todos : activeTodos).length === 0) && (
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
