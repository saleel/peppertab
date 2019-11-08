// @ts-check

import React from 'react';
import EyeIcon from '@iconscout/react-unicons/icons/uil-eye';
import EyeSlashIcon from '@iconscout/react-unicons/icons/uil-eye-slash';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import './calendar.scss';
import Todo from '../../model/todo';
import TodoItem from '../todo-item';
import Card from '../card';
import CalendarItem from './calendar-item';

// AIzaSyBOXuQDGtvOto1RIJpR7ab6aJ4Jk7s7PpM

const { gapi } = window;


function Calendar() {
  const { generalStore } = React.useContext(StoreContext);

  const signInButtonRef = React.useRef(null);

  const [events, { isFetching }] = usePromise(
    () => generalStore.getEvents(),
    { cacheKey: 'CALENDAR' },
  );


  function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }


  return (
    <Card title="Today">

      <div className="calendar fade-in">

        {!events && !isFetching && (
          <button ref={signInButtonRef} type="button" onClick={handleAuthClick}>Sign in</button>
        )}

        <div className="calendar__items">
          {events && events.map((event) => (
            <CalendarItem event={event} />
          ))}
        </div>

      </div>

    </Card>
  );
}


export default Calendar;
