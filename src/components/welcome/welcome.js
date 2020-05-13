import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import endOfDay from 'date-fns/endOfDay';
import getHours from 'date-fns/getHours';
import { getMessagePrefix } from './welcome.utils';
import useSettings from '../../hooks/use-settings';
import { SettingKeys } from '../../constants';
import useTime from '../../hooks/use-time';
import Quotes from '../quotes';
import './welcome.scss';


const dayStart = 6;
const dayDurationInMins = (24 - dayStart) * 60;
const diffMultiplier = 100 / dayDurationInMins;


function Welcome() {
  const [name] = useSettings(SettingKeys.name, '');
  const time = useTime(1000);

  const message = getMessagePrefix();

  const showPercentRemaining = getHours(new Date()) >= 6;
  const endOfToday = endOfDay(time);
  const percentOfDayRemaining = Math.ceil(differenceInMinutes(endOfToday, time) * diffMultiplier);


  return (
    <div className="welcome">
      <div className="welcome__has-profile">

        <div className="welcome__message">
          {message}
          {' '}
          <span className="welcome__name">{name}</span>
        </div>

        <div className="welcome__remaining fade-in">
          {showPercentRemaining ? (
            <>
              <span>You have</span>
              <span className="welcome__remaining-percent">
                {percentOfDayRemaining.toFixed(0)}
                %
              </span>
              <span>of the day left.</span>
            </>
          ) : (
            <span>Have a good sleep!</span>
          )}
        </div>

        {showPercentRemaining && (
          <Quotes percentOfDayRemaining={percentOfDayRemaining} />
        )}

      </div>
    </div>
  );
}


export default React.memo(Welcome);
