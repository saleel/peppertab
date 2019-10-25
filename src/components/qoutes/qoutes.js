import React from 'react';
import StoreContext from '../../contexts/store-context';
import './qoutes.scss';
import useStore from '../../hooks/use-store';


function Qoutes() {
  const { generalStore } = React.useContext(StoreContext);

  // const [qoute] = useStore(() => generalStore.getQoute());

  const qoute = {
    message: 'Let us think the unthinkable, let us do the undoable, let us prepare to grapple with the ineffable itself, and see if we may not eff it after all.',
    author: 'Saleel',
  };


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
