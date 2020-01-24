// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import LinkIcon from '@iconscout/react-unicons/icons/uil-external-link-alt';
import isSameDay from 'date-fns/isSameDay';
import './calendar-item.scss';


function CalendarItem(props) {
  const { event } = props;

  const {
    title, startDateTime, endDateTime, location, link,
  } = event;


  let endTimeFormat = ' - hh:mm a';
  if (startDateTime && endDateTime) {
    if (!isSameDay(new Date(startDateTime), new Date(endDateTime))) {
      endTimeFormat = ' - MMM dd hh:mm a';
    }
  }
  // if (startTime && endTime) {
  //   if (!isSameDay(new Date(startTime), new Date(endTime))) {
  //     endTimeFormat = 'MMM DD hh:mm a';
  //   }
  // }


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
            {endDateTime && format(new Date(endDateTime), endTimeFormat)}
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
    startDateTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    endDateTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    location: PropTypes.string,
  }).isRequired,
};


export default CalendarItem;
