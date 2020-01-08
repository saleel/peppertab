// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import Todo from '../../model/todo';
import './todo-item.scss';


/**
 *
 * @param {{ todo: Todo, onCompleteClick: (boolean) => (any) }} props
 */
function TodoItem(props) {
  const { todo, onCompleteClick } = props;

  const [isCompleted, setIsCompleted] = React.useState(todo.isCompleted);


  React.useEffect(() => {
    setIsCompleted(todo.isCompleted);
  }, [todo]);


  let className = 'todo-item fade-in';
  if (todo.isCompleted) {
    className += ' todo-item--completed';
  }

  return (
    <div className={className}>

      <div className="pretty p-svg p-round">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={async (e) => {
            await onCompleteClick(e.target.checked);
            setIsCompleted((a) => !a);
          }}
        />

        <div className="state">
          <svg className="svg svg-icon" viewBox="0 0 20 20">
            <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style={{ stroke: 'white', fill: 'white' }} />
          </svg>
          <label /> {/* eslint-disable-line */}
        </div>
      </div>

      <span className="todo-item__title">{todo.title}</span>

    </div>
  );
}


TodoItem.propTypes = {
  todo: PropTypes.instanceOf(Todo).isRequired,
  onCompleteClick: PropTypes.func.isRequired,
};


export default TodoItem;
