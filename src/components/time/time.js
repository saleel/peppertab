import React from 'react';
import { format } from 'date-fns';
import './time.scss';


function Time() {
  const [time, setTime] = React.useState(new Date());


  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  });


  const hours = format(time, 'HH:mm');
  const seconds = format(time, 'ss');


  return (
    <div className="time">
      <div className="time__hours">{hours}</div>
      <div className="time__seconds">{seconds}</div>
    </div>
  );
}


export default Time;
