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


// @ts-ignore
const browser = window.browser || window.chrome;


function Calendar() {
  const { generalStore } = React.useContext(StoreContext);

  const [googleToken, setGoogleToken] = React.useState();

  const signInButtonRef = React.useRef(null);

  const [events] = usePromise(
    () => (googleToken ? generalStore.getEvents(googleToken) : undefined),
    { dependencies: [googleToken] },
  );

  console.log(events);


  const isCalendarEnabled = Array.isArray(events);
  const groupedEvents = events && groupBy(events, (event) => {
    const start = new Date(event.startDateTime || event.startDate);
    return format(start, 'yyyy-MM-dd');
  });


  function handleAuthClick() {
    let redirectURL = browser.identity.getRedirectURL();
    redirectURL = redirectURL.endsWith('/') ? redirectURL.slice(0, -1) : redirectURL;

    const clientID = '492631281745-ukpj3nrml396bot57q9ikrhd9d46b8qm.apps.googleusercontent.com';
    const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
    let authURL = 'https://accounts.google.com/o/oauth2/auth';
    authURL += `?client_id=${clientID}`;
    authURL += '&response_type=token';
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

    browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authURL,
    }, (returnUrl) => {
      const accessToken = returnUrl.split('access_token=')[1].split('&')[0];
      console.log(accessToken);
      setGoogleToken(accessToken);
    });
  }


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
