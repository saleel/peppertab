import React from 'react';
import moment from 'moment';
import './time.scss';


function Time() {
  const [time, setTime] = React.useState(new Date());


  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  });


  const momentTime = moment(time);
  const hours = momentTime.format('HH:mm');
  const seconds = momentTime.format('ss');


	return (
		<div className="time">
			<div className="time__hours">{hours}</div>
			<div className="time__seconds">{seconds}</div>
		</div>
	);
}


export default Time;
