// @ts-check

import React from 'react';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import './todo-list.scss';
import Todo from '../../model/todo';
import TodoItem from '../todo-item';
import Card from '../card';


function TodoList() {
  const { todoStore } = React.useContext(StoreContext);
  const [todos, { reFetch }] = useStore(() => todoStore.findTodos(), []);

  const [newTodo, setNewTodo] = React.useState({ title: '' });


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
      await todoStore.createTodo(new Todo(newTodo));
      setNewTodo({ title: '' });
      reFetch();
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


  return (
    <Card title="Todos" className="todo-list">
      <>

        <div className="todo-list__items">
          {todos.map((todo) => (
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

      </>
    </Card>
  );
}


export default TodoList;
