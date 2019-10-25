import React from 'react';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import './quotes.scss';


function Quotes() {
  const { generalStore } = React.useContext(StoreContext);

  const [quote] = useStore(() => generalStore.getQuote());


  if (!quote) return null;


  return (
    <div className="quotes fade-in">
      <div className="quotes__message">
        <span>{quote.message}</span>
        <span> -</span>
        <span className="quotes__author">{quote.author}</span>
      </div>
    </div>
  );
}


export default Quotes;
