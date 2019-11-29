import React from 'react';
import PropTypes from 'prop-types';
import './spinner.scss';


function Sync(props) {
  const { size, color } = props;


  return (
    <div className="spinner">
      <div className="spinner__ring" style={{ '--size': `${size}px`, color }} />
    </div>
  );
}


Sync.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};


Sync.defaultProps = {
  size: 40,
  color: '#fff',
};


export default Sync;
