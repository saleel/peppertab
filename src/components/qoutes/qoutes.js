import React from 'react';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import './qoutes.scss';


function Qoutes() {
  const { generalStore } = React.useContext(StoreContext);

  const [qoute] = useStore(() => generalStore.getQoute());


  if (!qoute) return null;


  return (
    <div className="qoutes fade-in">
      <div className="qoutes__message">
        <span>{qoute.message}</span>
        <span> -</span>
        <span className="qoutes__author">{qoute.author}</span>
      </div>
    </div>
  );
}


export default Qoutes;
