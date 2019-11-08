// @ts-check

import React from 'react';
import './calendar-item.scss';


function CalendarItem(props) {
  const { event } = props;

  const {
    summary, htmlLink, start, end, location,
  } = event;


  return (
    <div className="calendar-item">

      <div className="calendar-item__title">
        {summary}
      </div>

      <div className="calendar-item__location">
        {location}
      </div>

    </div>
  );
}


export default CalendarItem;
