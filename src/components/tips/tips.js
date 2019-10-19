import React from 'react';
import PropTypes from 'proptypes';
import './tips.scss';


function Tips(props) {
  const { message, actionText, onAction } = props;

  return (
    <div className="tips">
      <span className="tips__message">{message}</span>

      {actionText && (
        <button
          className="tips__btn-action"
          onClick={onAction}
          type="button"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}


Tips.propTypes = {
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

Tips.defaultProps = {
  actionText: undefined,
  onAction: undefined,
};


export default Tips;
