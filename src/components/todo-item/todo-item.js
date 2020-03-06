// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { SortableHandle } from 'react-sortable-hoc';
import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import Todo from '../../model/todo';
import './todo-item.scss';
import FormModal from '../form-modal';


const DragHandle = SortableHandle(() => <span>::</span>);


/**
 *
 * @param {{ todo: Todo, onUpdate: Function, onDeleteClick: Function }} props
 */
function TodoItem(props) {
  const {
    todo, onUpdate, onDeleteClick,
  } = props;

  const [isCompleted, setIsCompleted] = React.useState(todo.isCompleted);
  const [isEditOpen, setIsEditOpen] = React.useState(false);


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
            await onUpdate({ isCompleted: e.target.checked });
            setIsCompleted((a) => !a);
          }}
        />

        <div className="state">
          <svg className="svg svg-icon" viewBox="0 0 20 20">
            <path
              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
              style={{ stroke: 'var(--text-color-6)', fill: 'var(--text-color-6)' }}
            />
          </svg>
          <label /> {/* eslint-disable-line */}
        </div>
      </div>

      <span className="todo-item__title">{todo.title}</span>

      {!todo.isCompleted && (
        <>
          <button
            className="todo-item__edit"
            type="button"
            onClick={() => { setIsEditOpen(true); }}
          >
            <UilPen size="16" />
          </button>

          <div className="todo-item__drag-handle">
            <DragHandle />
          </div>
        </>
      )}

      {isEditOpen && (
        <FormModal
          title="Edit Todo"
          isOpen={isEditOpen}
          properties={{
            title: { type: 'String', title: 'Title', maxLength: 50 },
          }}
          values={{
            title: todo.title,
          }}
          onSubmit={async (v) => {
            await onUpdate(v);
            setIsEditOpen(false);
          }}
          onDelete={onDeleteClick}
          onClose={() => { setIsEditOpen(false); }}
        />
      )}

    </div>
  );
}


TodoItem.propTypes = {
  todo: PropTypes.instanceOf(Todo).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};


export default TodoItem;
