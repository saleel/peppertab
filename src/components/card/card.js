// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import './card.scss';


function Card(props) {
  const {
    children, actions, title, className, contentClassName,
  } = props;

  return (
    <div className={`card ${className}`}>
      <div className="card__title">
        {title}

        <div className="card__actions">
          {actions}
        </div>
      </div>
      <div className={`card__content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}


Card.propTypes = {
  children: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
};

Card.defaultProps = {
  className: '',
  contentClassName: '',
  actions: [],
};


export default Card;
