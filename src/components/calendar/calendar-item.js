// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import LinkIcon from '@iconscout/react-unicons/icons/uil-external-link-alt';
import './calendar-item.scss';


function CalendarItem(props) {
  const { event } = props;

  const {
    title, startDateTime, endDateTime, location, link,
  } = event;


  return (
    <div className="calendar-item">

      <div className="calendar-item__title">
        {title}
      </div>

      <div className="calendar-item__link">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <a href={link} target="_blank" rel="noopener noreferrer"><LinkIcon size="16" /></a>
      </div>


      <div className="calendar-item__details">

        <div className="calendar-item__time">
          <span>
            {startDateTime && format(new Date(startDateTime), 'hh:mm a')}
            {endDateTime && format(new Date(endDateTime), ' - hh:mm a')}
            {!startDateTime && !endDateTime && 'All Day'}
          </span>
        </div>

        <div className="calendar-item__location">
          {location}
        </div>
      </div>

    </div>
  );
}


CalendarItem.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    startDateTime: PropTypes.string.isRequired,
    endDateTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};


export default CalendarItem;
