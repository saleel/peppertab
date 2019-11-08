// @ts-check

import React from 'react';
import './calendar-item.scss';
import format from 'date-fns/format';


function CalendarItem(props) {
  const { event } = props;

  const {
    title, link, startDateTime, endDateTime, location,
  } = event;


  return (
    <div className="calendar-item">

      <div className="calendar-item__title">
        {title}
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


export default CalendarItem;
