// @ts-check

import React from 'react';
import groupBy from 'lodash/groupBy';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import Card from '../card';
import CalendarItem from './calendar-item';
import './calendar.scss';


function Calendar() {
  const { generalStore } = React.useContext(StoreContext);

  const signInButtonRef = React.useRef(null);

  const [events, { isFetching, reFetch }] = usePromise(
    () => generalStore.getEvents(),
    { cacheKey: 'CALENDAR' },
  );


  const isCalendarEnabled = Array.isArray(events);
  const groupedEvents = events && groupBy(events, (event) => {
    const start = new Date(event.startDateTime || event.startDate);
    return format(start, 'yyyy-MM-dd');
  });


  function handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
    window.gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => signedIn && reFetch());
  }


  function renderGroup(groupKey) {
    const groupDate = new Date(groupKey);
    const eventsInGroup = groupedEvents[groupKey];

    let dateLabel = format(groupDate, 'EEE, dd LLL');
    if (isToday(groupDate)) dateLabel = 'Today';
    if (isTomorrow(groupDate)) dateLabel = 'Tomorrow';

    return (
      <div className="calendar__group">

        <div className="calendar__group-name">{dateLabel}</div>

        {eventsInGroup.map((event) => (
          <CalendarItem event={event} />
        ))}
      </div>
    );
  }


  return (
    <Card title="Upcoming">

      <div className="calendar fade-in">

        {!isCalendarEnabled && (
          <div className="calendar__enroll">
            <div>
              Integrate with Google Calendar to see upcoming events
            </div>
            <button
              className="calendar__btn-sign-in"
              ref={signInButtonRef}
              type="button"
              onClick={handleAuthClick}
              aria-label="Sign in with Google"
            />
          </div>
        )}

        {isCalendarEnabled && (
          <div className="calendar__events">
            {groupedEvents && Object.keys(groupedEvents).map(renderGroup)}
          </div>
        )}

      </div>

    </Card>
  );
}


export default Calendar;
