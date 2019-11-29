// @ts-check

import React from 'react';
import groupBy from 'lodash/groupBy';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import Card from '../card';
import Spinner from '../spinner';
import CalendarItem from '../calendar-item';
import { CacheKeys } from '../../constants';
import './calendar.scss';


function Calendar() {
  const { generalStore } = React.useContext(StoreContext);

  const isCalendarEnabled = generalStore.isCalendarEnabled();

  const signInButtonRef = React.useRef(null);

  const [isTrying, setIsTrying] = React.useState(false);


  const [events, { isFetching, error, reFetch }] = usePromise(
    () => generalStore.getEvents(),
    {
      cacheKey: CacheKeys.calendar,
      cachePeriodInSecs: (60 * 2),
      conditions: [isCalendarEnabled],
      dependencies: [isCalendarEnabled],
    },
  );


  const hasEvents = events && events.length;


  async function handleAuthClick() {
    setIsTrying(true);
    await generalStore.getEvents();
    reFetch();
  }


  const groupedEvents = events && groupBy(events, (event) => {
    const start = new Date(event.startDateTime || event.startDate);
    return format(start, 'yyyy-MM-dd');
  });


  function renderGroup(groupKey) {
    const groupDate = new Date(groupKey);
    const eventsInGroup = groupedEvents[groupKey];

    let dateLabel = format(groupDate, 'EEE, dd LLL');
    if (isToday(groupDate)) dateLabel = 'Today';
    if (isTomorrow(groupDate)) dateLabel = 'Tomorrow';

    return (
      <div key={groupKey} className="calendar__group">

        <div className="calendar__group-name">{dateLabel}</div>

        {eventsInGroup.map((event) => (
          <CalendarItem key={event.link} event={event} />
        ))}
      </div>
    );
  }


  return (
    <Card title="Upcoming">

      <div className="calendar fade-in">

        {(isTrying || isFetching) && !hasEvents && (
          <div className="">
            <Spinner color="#303133" />
          </div>
        )}

        {hasEvents && (
          <div className="calendar__events">
            {groupedEvents && Object.keys(groupedEvents).map(renderGroup)}
          </div>
        )}

        {!isCalendarEnabled && !isTrying && (
          <div className="calendar__enroll">
            {error && (
              <div className="calendar__enroll-error">
                Unexpected error occurred while connecting with your Google account. Please try again later.
              </div>
            )}

            {!error && (
              <div>
                Integrate with Google Calendar to see upcoming events
              </div>
            )}

            <button
              className="calendar__btn-sign-in"
              ref={signInButtonRef}
              type="button"
              onClick={handleAuthClick}
              aria-label="Sign in with Google"
            />
          </div>
        )}

      </div>

    </Card>
  );
}


export default Calendar;
