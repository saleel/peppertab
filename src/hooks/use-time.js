import React from 'react';
import useInterval from './use-interval';


function useTime(delay) {
  const [time, setTime] = React.useState(new Date());


  useInterval(() => {
    setTime(new Date());
  }, delay);

  return time;
}


export default useTime;
