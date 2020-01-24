import React from 'react';
import format from 'date-fns/format';
import useInterval from '../../hooks/use-interval';
import { SettingKeys } from '../../constants';
import useSettings from '../../hooks/use-settings';
import './time.scss';


function Time() {
  const [time, setTime] = React.useState(new Date());
  const [timeFormat] = useSettings(SettingKeys.timeFormat, '24');


  useInterval(() => {
    setTime(new Date());
  }, 1000);


  let hours = format(time, 'HH:mm');
  let seconds = format(time, 'ss');

  if (timeFormat === '12') {
    hours = format(time, 'hh:mm');
    seconds = format(time, 'a');
  }


  return (
    <div className="time">
      <div className="time__hours">{hours}</div>
      <div className="time__seconds">{seconds}</div>
    </div>
  );
}


export default Time;
