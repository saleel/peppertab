// @ts-check

import React from 'react';
import groupBy from 'lodash/groupBy';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isAfter from 'date-fns/isAfter';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import formatDistance from 'date-fns/formatDistance';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import Card from '../card';
import Spinner from '../spinner';
import CalendarItem from '../calendar-item';
import { CacheKeys, SettingKeys } from '../../constants';
import useSettings from '../../hooks/use-settings';
import './calendar.scss';


function Calendar() {
  const { generalStore } = React.useContext(StoreContext);

  const [isCalendarEnabled, setIsCalendarEnabled] = useSettings(SettingKeys.isCalendarEnabled, false);

  const signInButtonRef = React.useRef(null);

  const [isTrying, setIsTrying] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(null);


  const [events, {
    isFetching, error, reFetch, fetchedAt,
  }] = usePromise(
    () => generalStore.getEvents(),
    {
      cacheKey: CacheKeys.calendar,
      cachePeriodInSecs: (60 * 2),
      conditions: [isCalendarEnabled],
    },
  );


  React.useEffect(() => {
    if (error) {
      setIsCalendarEnabled(false);
      setFetchError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);


  async function handleAuthClick() {
    setIsTrying(true);
    try {
      await generalStore.getEvents();
      setIsCalendarEnabled(true);
    } catch (e) {
      setIsCalendarEnabled(false);
      setFetchError(e);
    }
    setIsTrying(false);
  }


  const filteredEvents = (events || [])
    .filter((e) => (e.endDateTime ? isAfter(new Date(e.endDateTime), new Date()) : true));

  const groupedEvents = events && groupBy(filteredEvents, (event) => {
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


  function renderFooter() {
    if (!Array.isArray(events)) {
      return null;
    }

    if (isFetching) {
      return (
        <div className="calendar__footer">
          <span className="calendar__footer-icon">
            <SyncIcon size="12" />
          </span>
          Updating...
        </div>
      );
    }

    if (fetchedAt) {
      return (
        <div className="calendar__footer">
          {'Updated '}
          {formatDistance(new Date(fetchedAt), new Date())}
          {' ago'}
        </div>
      );
    }

    return null;
  }


  function renderBody() {
    if (fetchError) {
      return (
        <div className="calendar__enroll">
          <div className="calendar__enroll-error">
            Unexpected error occurred while connecting with your Google account. Please try again later.
          </div>
        </div>
      );
    }

    if (!isCalendarEnabled && !isTrying) {
      return (
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
      );
    }

    // Calendar is enabled
    if (isTrying) {
      return (
        <Spinner color="var(--text-color-3)" />
      );
    }


    if (Array.isArray(events)) {
      return (
        <>
          <div className="calendar__events">
            {(events.length === 0) && !isFetching && (
              <div className="calendar__no-events fade-in">
                No upcoming events in the coming month.
              </div>
            )}

            {(events.length > 0) && groupedEvents && Object.keys(groupedEvents).map(renderGroup)}
          </div>

          {renderFooter()}
        </>
      );
    }

    return null;
  }

  const actions = [
    isCalendarEnabled && !isFetching && (
      <button key="sync" type="button" className="calendar__sync-btn fade-in" onClick={() => reFetch()}>
        <SyncIcon size="20" />
      </button>
    ),
  ].filter(Boolean);


  return (
    <Card title="Upcoming" actions={actions}>

      <div className="calendar fade-in">
        {renderBody()}
      </div>

    </Card>
  );
}


export default Calendar;
