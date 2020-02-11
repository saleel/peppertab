import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import endOfDay from 'date-fns/endOfDay';
import { getMessagePrefix } from './welcome.utils';
import useSettings from '../../hooks/use-settings';
import { SettingKeys } from '../../constants';
import useTime from '../../hooks/use-time';
import './welcome.scss';
import Quotes from '../quotes';


function Welcome() {
  const [name] = useSettings(SettingKeys.name, '');
  const time = useTime(1000);

  const message = getMessagePrefix();
  const endOfToday = endOfDay(time);
  const percentOfDayRemaining = differenceInMinutes(endOfToday, time) * 0.0694;


  return (
    <div className="welcome">
      <div className="welcome__has-profile">

        <div className="welcome__message">
          {message}
          {' '}
          <span className="welcome__name">{name}</span>
        </div>

        <div className="welcome__remaining fade-in">
          <span>You have</span>
          <span className="welcome__remaining-percent">
            {percentOfDayRemaining.toFixed(0)}
            %
          </span>
          <span>of the day left.</span>
        </div>

        <Quotes />

      </div>
    </div>
  );
}


export default React.memo(Welcome);
