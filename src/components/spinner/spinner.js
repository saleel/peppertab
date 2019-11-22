import React from 'react';
import PropTypes from 'prop-types';
import './spinner.scss';


function Sync(props) {
  const { size } = props;


  return (
    <div className="spinner">
      <div className="spinner__ring" style={{ '--size': `${size}px` }} />
    </div>
  );
}


Sync.propTypes = {
  size: PropTypes.number,
};


Sync.defaultProps = {
  size: 40,
};


export default Sync;
