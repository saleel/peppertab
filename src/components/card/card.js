// @ts-check

import React from 'react';
import PropTypes from 'proptypes';
import './card.scss';


function Card({ children, title, className }) {
  return (
    <div className={`card ${className}`}>
      <div className="card__title">
        {title}
      </div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
}


Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
};


export default Card;
